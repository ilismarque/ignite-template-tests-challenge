import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Statement", () => {

  beforeAll(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepository);
  });

  it("should be able to make a deposit into an existent account", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "User",
      email: "user@email.com",
      password: "user_pass123"
    });

    await usersRepositoryInMemory.create(user);

    const response = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 100,
      description: "deposit test",
      type: 'deposit' as OperationType
    });

    expect(response).toHaveProperty("id");
  });

  it("should not be able to make a deposit into an non existent account", () => {
    expect(async () => {
      await createStatementUseCase.execute(
        {
          user_id: 'userId',
          amount: 100,
          description: "deposit test",
          type: 'deposit' as OperationType
        });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be able to withdraw to an account with sufficient balance", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "User",
      email: "user@email.com",
      password: "user_pass123"
    });
    await usersRepositoryInMemory.create(user);

    const deposit = {
      user_id: user.id as string,
      amount: 100,
      description: "deposit test",
      type: 'deposit' as OperationType
    };

    await createStatementUseCase.execute(deposit);

    const response = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 50,
      description: "deposit test",
      type: 'withdraw' as OperationType
    });

    expect(response).toHaveProperty("id");
  });

  it("should not be able to withdraw from an account with insufficient balance", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "User",
      email: "user@email.com",
      password: "user_pass123"
    });
    await usersRepositoryInMemory.create(user);

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 100,
        description: "deposit test",
        type: 'withdraw' as OperationType
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);

  });

});