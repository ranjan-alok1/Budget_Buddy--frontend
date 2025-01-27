import React from "react";
import { Progress } from "antd";

const Analytics = ({ allTransaction }) => {
    const categories = [
        "salary",
        "tip",
        "project",
        "food",
        "movie",
        "bills",
        "medical",
        "fee",
        "tax",
    ];

    const totalTransaction = allTransaction.length;
    const totalIncomeTransactions = allTransaction.filter(
        (transaction) => transaction.type === "income"
    );
    const totalExpenseTransactions = allTransaction.filter(
        (transaction) => transaction.type === "expense"
    );
    const totalIncomePercent =
        (totalIncomeTransactions.length / totalTransaction) * 100;
    const totalExpensePercent =
        (totalExpenseTransactions.length / totalTransaction) * 100;

    const totalTurnover = allTransaction.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
    );
    const totalIncomeTurnover = allTransaction
        .filter((transaction) => transaction.type === "income")
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalExpenseTurnover = allTransaction
        .filter((transaction) => transaction.type === "expense")
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalIncomeTurnoverPercent =
        (totalIncomeTurnover / totalTurnover) * 100;
    const totalExpenseTurnoverPercent =
        (totalExpenseTurnover / totalTurnover) * 100;

    return (
        <>
            <div className="row m-3">
                <div className="col-md-3">
                    <div className="card">
                        <h6 className="bg-dark bg-gradient p-2 text-light">Total no. of Transactions = {totalTransaction}</h6>
                        <div className="card-body">
                            <h5 className="text-success">
                                Income Transactions : {totalIncomeTransactions.length}
                            </h5>
                            <h5 className="text-danger">
                                Expense Transactions : {totalExpenseTransactions.length}
                            </h5>
                            <div className="d-flex flex-column align-items-center">
                                <Progress
                                    type="circle"
                                    strokeColor={"green"}
                                    className="mx-2"
                                    percent={totalIncomePercent.toFixed(0)}
                                />
                                <Progress
                                    type="circle"
                                    strokeColor={"red"}
                                    className="mx-2 mt-3"
                                    percent={totalExpensePercent.toFixed(0)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card">
                        <h6 className="bg-dark bg-gradient p-2 text-light">Total Turnover = {totalTurnover}</h6>
                        <div className="card-body">
                            <h5 className="text-success">Income : {totalIncomeTurnover}</h5>
                            <h5 className="text-danger">Expense : {totalExpenseTurnover}</h5>
                            <div className="d-flex flex-column align-items-center">
                                <Progress
                                    type="circle"
                                    strokeColor={"green"}
                                    className="mx-2"
                                    percent={totalIncomeTurnoverPercent.toFixed(0)}
                                />
                                <Progress
                                    type="circle"
                                    strokeColor={"red"}
                                    className="mx-2 mt-3"
                                    percent={totalExpenseTurnoverPercent.toFixed(0)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category-wise Income Section */}
                <div className="col-md-3">
                    <h6 className="bg-success bg-gradient p-2 text-light">Category-wise Income</h6>
                    {categories.map((category) => {
                        const amount = allTransaction
                            .filter(
                                (transaction) =>
                                    transaction.type === "income" &&
                                    transaction.category === category
                            )
                            .reduce((acc, transaction) => acc + transaction.amount, 0);
                        return (
                            amount > 0 && (
                                <div className="card mt-2" key={category}>
                                    <div className="card-body">
                                        <h6>{category}</h6>
                                        <Progress
                                            percent={((amount / totalIncomeTurnover) * 100).toFixed(0)}
                                        />
                                    </div>
                                </div>
                            )
                        );
                    })}
                </div>

                {/* Category-wise Expense Section */}
                <div className="col-md-3">
                    <h6 className="bg-danger bg-gradient p-2 text-light">Category-wise Expense</h6>
                    {categories.map((category) => {
                        const amount = allTransaction
                            .filter(
                                (transaction) =>
                                    transaction.type === "expense" &&
                                    transaction.category === category
                            )
                            .reduce((acc, transaction) => acc + transaction.amount, 0);
                        return (
                            amount > 0 && (
                                <div className="card mt-2" key={category}>
                                    <div className="card-body">
                                        <h6>{category}</h6>
                                        <Progress
                                            strokeColor="red"
                                            percent={((amount / totalExpenseTurnover) * 100).toFixed(0)}
                                        />
                                    </div>
                                </div>
                            )
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Analytics;
