import React, { useState } from "react";
import { Dropdown } from "semantic-ui-react";

export default function FilterProducts({ products, setFilteredList, list }) {

  const [filterName, setFilterName] = useState("Filter by Medium")

  const filterProducts = (selectedDepartment) => {
    const newerList = products.filter(product => product.department === selectedDepartment);
    setFilteredList(newerList);
  }



  //grabs the products state. filters the array of objects and returns only the objects whose department matches value of the mapped item with no duplicates
  return (
    <Dropdown id="header-filter" text={filterName}>
      <Dropdown.Menu>
        <Dropdown.Item content='All Mediums' onClick={async () => {
          setFilteredList([])
          setFilterName("All Mediums")
        }} />
        {list.map((department, index) => (
          <Dropdown.Item key={`departmentId-${index}`} content={department} onClick={() => {
            console.log('the department: ', department)
            setFilteredList([])
            filterProducts(department)
            setFilterName(department)
          }} />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
