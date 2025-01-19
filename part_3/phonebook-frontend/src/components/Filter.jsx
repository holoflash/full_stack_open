const Filter = ({ filterBy, handleFilter }) => {
    return (
        <div>Filter: <input value={filterBy} onChange={handleFilter} /></div>
    )
};

export default Filter