import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { User } from "../App";

function UserRecords({ data }: { data: User[] | undefined }) {
  return (
    <>
      <table className="table-auto  border-separate shadow-md border-spacing-y-3    rounded-md w-[90%] mt-10   ">
        <thead className="text-center text-gray-500 tracking-wider">
          <tr className="">
            <th>
              <input type="checkbox" className="w-4 h-4" />
            </th>
            <th className="text-xl">Name</th>
            <th className="text-xl">Email</th>
            <th className="text-xl">Role</th>
            <th className="flex gap-10">
              <FiEdit size={20} color="black" />
            </th>
            <th>
              <MdDeleteOutline size={20} color="red" />
            </th>
          </tr>
        </thead>
        <tbody className="">
          {data?.map((user: User) => (
            <tr className=" bg-card rounded-md transition-all  hover:bg-slate-200 bg-slate-50  border h-12 gap-10  border-black  text-center">
              <td className="m-10 ">
                <input className="w-4 h-4" type="checkbox" />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <FiEdit size={20} color="black" />
              </td>
              <td>
                <MdDeleteOutline size={20} color="red" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default UserRecords;
