import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

actor {
  module UserData {
    public type Role = {
      #student;
      #teacher;
      #parent;
      #admin;
    };

    public type Attendance = {
      present : Nat;
      absent : Nat;
      late : Nat;
    };

    public type Id = {
      number : Nat;
      creator : Principal;
    };

    public type User = {
      id : Id;
      name : Text;
      email : Text;
      photo : Storage.ExternalBlob;
      phone : Nat;
      userRole : Role;
      subjects : [Text];
      parentOf : ?Id;
      attendance : Attendance;
    };

    public func compare(user1 : User, user2 : User) : Order.Order {
      switch (user1.name.compare(user2.name)) {
        case (#equal) { #equal };
        case (order) { order };
      };
    };
  };

  type Attendance = {
    user : UserData.User;
    percentage : Nat;
  };

  let attendances = List.empty<Attendance>();

  func updateAttendance(percentage : Nat, user : UserData.User) : UserData.Attendance {
    switch (percentage) {
      case (0) {
        {
          present = user.attendance.present + 1;
          absent = user.attendance.absent;
          late = user.attendance.late;
        };
      };
      case (1) {
        {
          present = user.attendance.present;
          absent = user.attendance.absent + 1;
          late = user.attendance.late;
        };
      };
      case (_) {
        {
          present = user.attendance.present;
          absent = user.attendance.absent;
          late = user.attendance.late + 1;
        };
      };
    };
  };

  module StudyMaterial {
    public type MaterialType = {
      #pdf;
      #note;
      #link;
    };

    public type Id = {
      number : Nat;
      creator : Principal;
    };

    public type Material = {
      id : Id;
      title : Text;
      subject : Text;
      materialType : MaterialType;
      url : Text;
      author : UserData.User;
      uploadedAt : Time.Time;
      description : Text;
      file : Storage.ExternalBlob;
    };

    public func compare(material1 : Material, material2 : Material) : Order.Order {
      switch (material1.subject.compare(material2.subject)) {
        case (#equal) {
          switch (material1.title.compare(material2.title)) {
            case (#equal) { #equal };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  let materials = Map.empty<Text, StudyMaterial.Material>();

  func createNewMaterial(author : UserData.User, material : StudyMaterial.Material) : StudyMaterial.Material {
    let newMaterial : StudyMaterial.Material = {
      material with
      author;
      uploadedAt = Time.now();
    };

    materials.add(material.title, newMaterial);
    newMaterial;
  };

  func getMaterialByTitle(title : Text) : StudyMaterial.Material {
    switch (materials.get(title)) {
      case (null) { Runtime.trap("Material not found") };
      case (?material) { material };
    };
  };

  public type UserRole = AccessControl.UserRole;

  public type UserProfile = {
    name : Text;
    email : Text;
    role : UserRole;
    appRole : UserData.Role;
    phone : Nat;
    subjects : [Text];
    parentOf : ?UserData.Id;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let userProfiles = Map.empty<Principal, UserProfile>();

  module Assignment {
    public type Submission = {
      studentId : UserData.Id;
      submittedAt : Time.Time;
      content : Text;
    };

    public type Assignment = {
      title : Text;
      subject : Text;
      dueDate : Time.Time;
      description : Text;
      createdBy : UserData.User;
      submissions : [Submission];
    };
  };

  module Message {
    public type Message = {
      senderId : UserData.Id;
      receiverId : UserData.Id;
      content : Text;
      timestamp : Time.Time;
      isRead : Bool;
    };
  };

  module Timetable {
    public type Entry = {
      dayOfWeek : Text;
      subject : Text;
      teacher : UserData.User;
      startTime : Text;
      endTime : Text;
      venue : Text;
    };
  };

  module Announcement {
    public type TargetRole = {
      #students;
      #teachers;
      #parents;
      #all;
    };

    public type Entry = {
      title : Text;
      content : Text;
      createdBy : UserData.User;
      createdAt : Time.Time;
      targetRole : TargetRole;
    };
  };

  // Helper function to check if caller is teacher or admin
  func isTeacherOrAdmin(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.appRole) {
          case (#teacher or #admin) { true };
          case (_) { false };
        };
      };
    };
  };

  // Helper function to check if caller is admin
  func isAppAdmin(caller : Principal) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.appRole) {
          case (#admin) { true };
          case (_) { false };
        };
      };
    };
  };

  // Helper function to check if caller is parent of student
  func isParentOf(caller : Principal, studentId : UserData.Id) : Bool {
    switch (userProfiles.get(caller)) {
      case (null) { false };
      case (?profile) {
        switch (profile.appRole) {
          case (#parent) {
            switch (profile.parentOf) {
              case (null) { false };
              case (?childId) {
                childId.number == studentId.number and Principal.equal(childId.creator, studentId.creator)
              };
            };
          };
          case (_) { false };
        };
      };
    };
  };

  // Required user profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    // Users can view their own profile, admins can view all, parents can view their children
    if (Principal.equal(caller, user)) {
      return userProfiles.get(user);
    };

    if (AccessControl.isAdmin(accessControlState, caller) or isAppAdmin(caller)) {
      return userProfiles.get(user);
    };

    // Check if caller is parent viewing their child's profile
    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?targetProfile) {
        switch (targetProfile.appRole) {
          case (#student) {
            // Get the student's ID from their profile
            let studentId : UserData.Id = {
              number = 0; // This would need to be stored properly
              creator = user;
            };
            if (isParentOf(caller, studentId)) {
              return ?targetProfile;
            };
          };
          case (_) {};
        };
        Runtime.trap("Unauthorized: Can only view your own profile or your children's profiles");
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Study Materials - Only authenticated users can view, only teachers can create
  public query ({ caller }) func getAllMaterials() : async [StudyMaterial.Material] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view materials");
    };
    materials.values().toArray();
  };

  public shared ({ caller }) func createMaterial(material : StudyMaterial.Material) : async StudyMaterial.Material {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create materials");
    };

    if (not isTeacherOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only teachers and admins can create materials");
    };

    createNewMaterial(material.author, material);
  };

  // Attendance - Teachers/admins can view all, students can view their own, parents can view their children's
  public query ({ caller }) func getAllAttendances() : async [Attendance] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view attendance");
    };

    if (not isTeacherOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only teachers and admins can view all attendance records");
    };

    attendances.toArray();
  };

  public query ({ caller }) func getMyAttendance() : async ?Attendance {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view attendance");
    };

    // Find attendance record for the caller
    attendances.toArray().find(
      func(a : Attendance) : Bool {
        Principal.equal(a.user.id.creator, caller)
      }
    );
  };

  public query ({ caller }) func getStudentAttendance(studentId : UserData.Id) : async ?Attendance {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view attendance");
    };

    // Teachers and admins can view any student's attendance
    if (isTeacherOrAdmin(caller)) {
      return attendances.toArray().find(
        func(a : Attendance) : Bool {
          a.user.id.number == studentId.number and Principal.equal(a.user.id.creator, studentId.creator)
        }
      );
    };

    // Parents can view their children's attendance
    if (isParentOf(caller, studentId)) {
      return attendances.toArray().find(
        func(a : Attendance) : Bool {
          a.user.id.number == studentId.number and Principal.equal(a.user.id.creator, studentId.creator)
        }
      );
    };

    // Students can only view their own
    if (Principal.equal(caller, studentId.creator)) {
      return attendances.toArray().find(
        func(a : Attendance) : Bool {
          a.user.id.number == studentId.number and Principal.equal(a.user.id.creator, studentId.creator)
        }
      );
    };

    Runtime.trap("Unauthorized: Can only view your own attendance or your children's attendance");
  };

  public shared ({ caller }) func markAttendance(studentId : UserData.Id, status : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can mark attendance");
    };

    if (not isTeacherOrAdmin(caller)) {
      Runtime.trap("Unauthorized: Only teachers and admins can mark attendance");
    };

    // Implementation would update attendance records
    // This is a placeholder for the actual implementation
  };
};
