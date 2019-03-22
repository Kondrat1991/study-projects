import React from 'react';


const Table = (props) => {
    return (
        <div>
            <thead>
            <tr>
                <th>ID</th>
                <th>First</th>
                <th>Last</th>
                <th>Handle</th>
            </tr>
            </thead>
        </div>
    );
};

Table.propTypes = {};
Table.defaultProps = {};

export default Table;
