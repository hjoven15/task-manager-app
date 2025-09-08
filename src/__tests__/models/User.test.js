import User from "../../models/User";

describe("User", () => {
  it("debería crear un usuario con id y nombre", () => {
    const user = new User("123", "Haminton Joven");

    expect(user.IdUser).toBe("123");
    expect(user.NameUser).toBe("Haminton Joven");
  });
});
