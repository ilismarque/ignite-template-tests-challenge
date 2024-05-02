import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able to list the user information", async () => {

    const user = await usersRepositoryInMemory.create({
      name: "User",
      email: "user@email.com",
      password: "user_pass123"
    });

    const response = await showUserProfileUseCase.execute(user.id as string);

    expect(response).toBeInstanceOf(User);
  });

  it("should not be able to list the user information when the user doesn't exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('1');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });


})