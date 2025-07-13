"use client";
import React from "react";
import useUserManagement from "./useUserManagement";

const UserManagement = () => {
  const [{ users, userRole }, { addUser, deleteUser, fetchUsers, updateUser }] =
    useUserManagement();

  console.log("users", users);

  if (userRole !== "admin") {
    return <div>Access Denied</div>;
  }
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">User Management</h1>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Avatar</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border px-4 py-2">
                <img
                  className="w-8 h-8 rounded-full mx-auto"
                  src={user.imageUrl || "/default-avatar.png"}
                  alt="User Avatar"
                />
              </td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2 capitalize">{user.role}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => updateUser(user)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
