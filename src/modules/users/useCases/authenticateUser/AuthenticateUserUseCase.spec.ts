import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUserCase: AuthenticateUserUseCase;
let user: ICreateUserDTO;

describe("Authenticate User", () => {

  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUserCase = new AuthenticateUserUseCase(usersRepositoryInMemory);

    user = {
      name: "User",
      email: "user@email.com",
      password: "user_pass123"
    }

    await createUserUseCase.execute(user)
  });

  it("Should be able to authenticate a user", async () => {
    const result = await authenticateUserUserCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty("token")
  })

  it("Should not be able to authenticate a user with incorrect password", () => {
    expect(async () => {
      await authenticateUserUserCase.execute({
        email: user.email,
        password: "wrong_pass"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should not be able to authenticate a user with incorrect email", () => {
    expect(async () => {
      await authenticateUserUserCase.execute({
        email: "wrong_email",
        password: user.password
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})