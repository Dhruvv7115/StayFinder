import { useContext, useState, createContext } from "react";

const EmailContext = createContext({});

const EmailContextProvider = ({children}) => {
  const [email, setEmail] = useState("");
  return (
    <EmailContext.Provider value={{email, setEmail}}>
      {children}
    </EmailContext.Provider>
  )
}

const useEmailContext = () => {
  const emailContext = useContext(EmailContext);
  return emailContext
}

export { useEmailContext, EmailContextProvider }