import { createContext, useState } from "react";


export const UserContext = createContext(null);
const UserProvider = ({children}) => {
    const defaultUser = JSON.parse(localStorage.getItem('user')) 
console.log(defaultUser,'defaiio');
  const [user, setUser] = useState(defaultUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
