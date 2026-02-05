import Time "mo:core/Time";
import Int "mo:core/Int";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  public type LibraryRole = {
    #Admin;
    #ResearchScholar;
    #GeneralStudent;
  };

  public type UserProfile = {
    name : Text;
    libraryRole : LibraryRole;
  };

  type SeatType = {
    #reserved;
    #general;
  };

  type Seat = {
    id : Nat;
    seatType : SeatType;
  };

  module SeatType {
    public func toText(seatType : SeatType) : Text {
      switch (seatType) {
        case (#reserved) { "Reserved" };
        case (#general) { "General" };
      };
    };
  };

  type Booking = {
    userId : Principal;
    seatId : Nat;
    startTime : Time.Time;
    endTime : Time.Time;
  };

  let seats = Map.empty<Nat, Seat>();
  let bookings = Map.empty<Principal, Booking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialize seats
  do {
    var id = 1;
    while (id <= 120) {
      let seatType = if (id <= 20) { #reserved } else { #general };
      seats.add(id, { id; seatType });
      id += 1;
    };
  };

  var openingHour : Int = 8;
  var closingHour : Int = 20;

  // Helper function to get library role
  func getLibraryRole(user : Principal) : ?LibraryRole {
    switch (userProfiles.get(user)) {
      case (?profile) { ?profile.libraryRole };
      case (null) { null };
    };
  };

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          libraryRole = existingProfile.libraryRole; // Preserve existing role
        };
        userProfiles.add(caller, updatedProfile);
      };
      case (null) {
        // New user gets GeneralStudent role by default
        let newProfile : UserProfile = {
          name = profile.name;
          libraryRole = #GeneralStudent;
        };
        userProfiles.add(caller, newProfile);
      };
    };
  };

  // Admin function to assign library roles
  public shared ({ caller }) func assignLibraryRole(user : Principal, role : LibraryRole) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can assign library roles");
    };

    switch (userProfiles.get(user)) {
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          name = existingProfile.name;
          libraryRole = role;
        };
        userProfiles.add(user, updatedProfile);
      };
      case (null) {
        // Create profile with default name if user doesn't exist
        let newProfile : UserProfile = {
          name = user.toText();
          libraryRole = role;
        };
        userProfiles.add(user, newProfile);
      };
    };
  };

  public query ({ caller }) func getAvailableSeats(startTime : Time.Time, endTime : Time.Time) : async [(Nat, SeatType)] {
    let availableSeats = List.empty<(Nat, SeatType)>();
    let userRole = getLibraryRole(caller);

    for ((id, seat) in seats.entries()) {
      var isBooked = false;

      // Check if seat is booked during the requested time
      for ((bookedUser, booking) in bookings.entries()) {
        if (booking.seatId == id and not (booking.endTime <= startTime or booking.startTime >= endTime)) {
          isBooked := true;
        };
      };

      if (not isBooked) {
        // Filter based on user's role
        switch (seat.seatType) {
          case (#reserved) {
            // Only show reserved seats to Research Scholars and Admins
            switch (userRole) {
              case (?#ResearchScholar) { availableSeats.add((id, seat.seatType)) };
              case (?#Admin) { availableSeats.add((id, seat.seatType)) };
              case (_) {}; // General Students cannot see reserved seats
            };
          };
          case (#general) {
            // General seats available to all
            availableSeats.add((id, seat.seatType));
          };
        };
      };
    };

    availableSeats.toArray();
  };

  public shared ({ caller }) func bookSeat(seatId : Nat, startTime : Time.Time, endTime : Time.Time) : async () {
    // Must be at least a user (not guest)
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can book seats");
    };

    // Check for existing active booking
    switch (bookings.get(caller)) {
      case (?_) { Runtime.trap("Cannot have multiple active bookings") };
      case (null) {
        // Verify seat exists
        switch (seats.get(seatId)) {
          case (null) { Runtime.trap("Seat does not exist") };
          case (?seat) {
            // Get user's library role
            let userRole = getLibraryRole(caller);

            // Enforce role-based seat access
            switch (seat.seatType) {
              case (#reserved) {
                // Only Research Scholars and Admins can book reserved seats
                switch (userRole) {
                  case (?#ResearchScholar) {}; // Allowed
                  case (?#Admin) {}; // Allowed
                  case (?#GeneralStudent) {
                    Runtime.trap("General Students cannot book reserved seats");
                  };
                  case (null) {
                    Runtime.trap("User profile not found. Please create a profile first.");
                  };
                };
              };
              case (#general) {
                // General seats can be booked by all authenticated users
                switch (userRole) {
                  case (null) {
                    Runtime.trap("User profile not found. Please create a profile first.");
                  };
                  case (_) {}; // All roles allowed
                };
              };
            };

            // Validate booking time
            let now = Time.now();
            if (startTime < now) {
              Runtime.trap("Cannot book in the past");
            };
            if (endTime <= startTime) {
              Runtime.trap("End time must be after start time");
            };

            let durationNanos = endTime - startTime;
            let twoHoursNanos : Int = 2 * 60 * 60 * 1_000_000_000;
            if (durationNanos != twoHoursNanos) {
              Runtime.trap("Bookings must be exactly 2 hours");
            };

            // Check if seat is already booked for this time slot
            for ((bookedUser, booking) in bookings.entries()) {
              if (booking.seatId == seatId and not (booking.endTime <= startTime or booking.startTime >= endTime)) {
                Runtime.trap("Seat is already booked for this time slot");
              };
            };

            let newBooking : Booking = {
              userId = caller;
              seatId;
              startTime;
              endTime;
            };
            bookings.add(caller, newBooking);
          };
        };
      };
    };
  };

  public shared ({ caller }) func cancelBooking() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can cancel bookings");
    };

    switch (bookings.get(caller)) {
      case (null) { Runtime.trap("No active booking found") };
      case (?booking) {
        // Users can only cancel their own bookings
        if (booking.userId != caller) {
          Runtime.trap("Cannot cancel another user's booking");
        };
        bookings.remove(caller);
      };
    };
  };

  public shared ({ caller }) func setLibraryHours(openHour : Int, closeHour : Int) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can set library hours");
    };
    if (openHour >= closeHour) {
      Runtime.trap("Opening hour must be before closing hour");
    };
    if (openHour < 0 or closeHour > 24) {
      Runtime.trap("Hours must be between 0 and 24");
    };
    openingHour := openHour;
    closingHour := closeHour;
  };

  public query ({ caller }) func getLibrarySchedule() : async [Nat] {
    // Public information, no auth required
    let schedule = List.empty<Nat>();
    let range = Int.rangeInclusive(openingHour, closingHour - 1);
    for (hour in range) {
      schedule.add(Int.abs(hour));
    };
    schedule.toArray();
  };

  public query ({ caller }) func getMyBookings() : async ?Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view bookings");
    };
    bookings.get(caller);
  };

  public query ({ caller }) func getAllBookings() : async [(Principal, Booking)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.toArray();
  };

  // Admin function to view all user profiles
  public query ({ caller }) func getAllUserProfiles() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all user profiles");
    };
    userProfiles.toArray();
  };

  // Admin function to get seat configuration
  public query ({ caller }) func getSeatConfiguration() : async { totalSeats : Nat; reservedSeats : Nat; generalSeats : Nat } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view seat configuration");
    };

    var reservedCount = 0;
    var generalCount = 0;

    for ((_, seat) in seats.entries()) {
      switch (seat.seatType) {
        case (#reserved) { reservedCount += 1 };
        case (#general) { generalCount += 1 };
      };
    };

    {
      totalSeats = reservedCount + generalCount;
      reservedSeats = reservedCount;
      generalSeats = generalCount;
    };
  };
};
