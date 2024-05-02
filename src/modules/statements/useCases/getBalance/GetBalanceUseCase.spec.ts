import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("should be able to list all deposit and withdraw and also total balance from a valid user", async () => {
    const user = await usersRepositoryInMemory.create({
      name: "User",
      email: "user@email.com",
      password: "user_pass123"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 100,
      description: "deposit test",
      type: 'deposit' as OperationType
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(response).toHaveProperty("statement");
    expect(response).toHaveProperty("balance");
  });

  it("should not be able to find the balance information from a inexistent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: ''
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  })

})