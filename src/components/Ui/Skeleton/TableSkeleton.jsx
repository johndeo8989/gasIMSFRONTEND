import React from 'react'

const TableSkeleton = () => {
    return (
        <div className={styles.tableContainer}>
            <table>
                <thead>
                    <tr>
                        <th>S.no</th>
                        <th>Date</th>
                        <th>Expense Type</th>
                        <th>Sht. Nara</th>
                        <th>Long. Nara</th>
                        <th>Expense</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        // SKELETON LOADING
                        Array.from({ length: 5 }).map((_, index) => (
                            <tr key={index}>
                                <td><div className="skeleton skeleton-text"></div></td>
                                <td><div className="skeleton skeleton-text"></div></td>
                                <td><div className="skeleton skeleton-text"></div></td>
                                <td><div className="skeleton skeleton-text"></div></td>
                                <td><div className="skeleton skeleton-text"></div></td>
                                <td><div className="skeleton skeleton-text"></div></td>
                                <td><div className="skeleton skeleton-button"></div></td>
                            </tr>
                        ))
                    ) : (
                        // ACTUAL DATA
                        currentBills.map((bill, index) => (
                            <tr key={bill._id}>
                                <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                <td>{bill?.date?.split('T')[0]}</td>
                                <td>{bill?.expenseType?.toUpperCase()}</td>
                                <td>{bill?.shortNarration}</td>
                                <td>{bill?.longNarration}</td>
                                <td>₹{bill?.expensePrice}</td>
                                <td><b>...</b></td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

    )
}

export default TableSkeleton