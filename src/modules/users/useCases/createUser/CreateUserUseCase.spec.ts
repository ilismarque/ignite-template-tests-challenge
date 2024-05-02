import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User",
      email: "user@email.com",
      password: "user_pass123"
    })

    expect(user).toHaveProperty("id")
  })

  it("Should not be able to create a new user if the email already existis", async () => {
    await createUserUseCase.execute({
      name: "User",
      email: "user@email.com",
      password: "user_pass123"
    })

    expect(async () => {
      await createUserUseCase.execute({
        name: "User",
        email: "user@email.com",
        password: "user_pass123"
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})