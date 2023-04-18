import { useEffect, useState } from "react";
import "./user.css";
import ReactPaginate from "react-paginate";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Pagination } from "antd";
import { config } from "../App";

const User = () => {
  // define state variables
  const [user, setUser] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // define constants
  const itemPerPage = 10;
  const visitedPage = page * itemPerPage;
  const total = Math.ceil(user.length / itemPerPage);

  // fetch users on component mount
  useEffect(() => {
    getUsers();
  }, []);

  // function to fetch users from the API
  const getUsers = async () => {
    try {
      const response = await fetch(`${config.endpoint}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error::", error);
    }
  };
  
  // function to delete a single user
  const deleteUser = (userSelected) => {
    const remainingUser = user.filter((user) => user.id !== userSelected.id);
    setUser(remainingUser);
    setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser.id !== userSelected.id));
  };

  // function to set the editing user
  const editUserDetails = (user) => {
    setEditingUser(user);
  };

  // function to handle editing a user
  const handleEditUser = (event) => {
    event.preventDefault();
    const updatedUser = {
      id: editingUser.id,
      name: event.target.name.value,
      email: event.target.email.value,
      role: event.target.role.value
    };
    const updatedUsers = user.map((userSelected) =>
      userSelected.id === editingUser.id ? updatedUser : userSelected
    );
    setUser(updatedUsers);
    setEditingUser(null);
  };

  // function to handle searching for a user
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // function to handle selecting a user
  const handleSelectUser = (user) => {
    if (selectedUsers.some((selectedUser) => selectedUser.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // function to handle deleting selected users
  const handleDeleteSelected = () => {
    const remainingUsers = user.filter((user) => !selectedUsers.some((selectedUser) => selectedUser.id === user.id));
    setUser(remainingUsers);
    setSelectedUsers([]);
  };

  // function to filter the user list based on search input
  const filteredUser = user.filter((userFilter) => {
    if (search === "") return true;
    return (
      userFilter.name.includes(search) ||
      userFilter.email.includes(search) ||
      userFilter.role.includes(search)
    );
  });

  // slice the user list based on current page
  const displayedUser = filteredUser.slice(visitedPage, visitedPage + itemPerPage);

  // function to handle page changes
  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  // render the component
  return (
    <div className="container">
      {editingUser ? (
        <form onSubmit={handleEditUser} className="form">
          <h2>Edit User</h2>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" defaultValue={editingUser.name} />
<label htmlFor="email">Email:</label>
<input type="email" name="email" defaultValue={editingUser.email} />
<label htmlFor="role">Role:</label>
<input type="text" name="role" defaultValue={editingUser.role} />
<button type="submit">Save</button>
<button onClick={() => setEditingUser(null)}>Cancel</button>
</form>
) : (
<>
<br />
<div className="table-top">
<input
           type="text"
           name="name"
           placeholder="Search by any field"
           value={search}
           onChange={handleSearch}
         />
<button
           className="delete-button"
           onClick={handleDeleteSelected}
           disabled={!selectedUsers.length}
         >
Delete Selected
</button>
</div>
<table className="table">
<thead>
<tr>
<th>
<input type="checkbox" onChange={(e) => {
if (e.target.checked) {
setSelectedUsers([...user]);
} else {
setSelectedUsers([]);
}
}} />{" "}
</th>
<th>Name</th>
<th>Email</th>
<th>Role</th>
<th>Action</th>
</tr>
</thead>
<tbody>
{displayedUser.map((user) => (
<tr key={user.id}>
<td>
<input
type="checkbox"
checked={selectedUsers.some((selectedUser) => selectedUser.id === user.id)}
onChange={() => handleSelectUser(user)}
/>
</td>
<td>{user.name}</td>
<td>{user.email}</td>
<td>{user.role}</td>
<td className="btn">
<button onClick={() => editUserDetails(user)}>
<AiFillEdit />{" "}
</button>
<button onClick={() => deleteUser(user)}>
<AiFillDelete />{" "}
</button>
</td>
</tr>
))}
</tbody>
</table>
<br />
<br />
<ReactPaginate
className="pagination"
previousLabel={"Prev"}
nextLabel={"Next"}
pageCount={total}
onPageChange={handlePageChange}
containerClassName={<Pagination />}
activeClassName={"active"}
/>
</>
)}
</div>
);
};

export default User;
