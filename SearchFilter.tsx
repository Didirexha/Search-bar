import React, { useState, useEffect } from 'react';

interface Item {
    id: number;
  name: string;
  username: string;
  email: string;
}


const SearchFilter: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredData, setFilteredData] = useState<Item[]>([]);
  const [sortField, setSortField] = useState<keyof Item>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [newItem, setNewItem] = useState<Item>({id: 0, name: '', username: '', email: ''});
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

const fetchData = async () => {
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const result: Item[] = await response.json();
        setData(result);
    }
    catch (error){
        console.error("error catching data", error);
    }
};

useEffect(() => {
    fetchData();
}, []);

const handleDelete = (id: number) => {
    console.log("Deleting item with id:", id);
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
}

useEffect(() => {
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const sortedData = filteredData.sort((a, b) => {
    if (sortOrder === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddItem = async () => {
    if (newItem.name && newItem.email && newItem.username) {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });

        const savedItem: Item = await response.json(); // The newly saved item with its database-generated id

        // Update the local state with the saved item
        setData([...data, savedItem]);
        setNewItem({id: 0, name: '', username: '', email: ''}); // Reset form
        setShowAddForm(false); // Hide the form after adding the item
      } catch (error) {
        console.error('Error adding item', error);
      }
    }
  };

  return (
    
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by First Name or Last Name..."
        style={{ padding: '10px', margin: '10px', width: '300px' }}
      />
    <table style={{ width: '100%', borderCollapse: 'collapse',}}>
    <label>Sort by:</label>
        <select onChange={(e) => setSortField(e.target.value as keyof Item)} value={sortField}>
          <option value="name">Name</option>
          <option value="id">ID</option>
        </select>
        <button onClick={toggleSortOrder}>
          Sort Order: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>
        <thead>
            <tr>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left',}}>FisrtName</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left',}}>email</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left',}}>username</th>
                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left',}}>ID</th>

            </tr>
        </thead>
        
        <tbody>
        {filteredData.map(item => (
            <tr key={item.id}>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left',}} >{item.name}</td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left',}} >{item.email}</td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left',}} >{item.username}</td>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left',}}>{item.id}</td>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
               
            </tr>
            ))}
        </tbody>
    </table>
     <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Cancel' : 'Add New Item'}
      </button>

      {/* Conditionally render the form if showAddForm is true */}
      {showAddForm && (
        <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newItem.name}
          onChange={handleNewItemChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newItem.username}
          onChange={handleNewItemChange}
        />
         <input
          type="text"
          name="email"
          placeholder="Email"
          value={newItem.email}
          onChange={handleNewItemChange}
        />
         <button onClick={handleAddItem}>Add Item</button>
      </div>
      )}
      
    </div>
  );
};

export default SearchFilter;
