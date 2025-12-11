import { useLogout } from "@/hooks/useLogout"



function Index() {
  const logout = useLogout
  return (
    <div>

    <h1>Index</h1>
      <button onClick={logout()}>Logout</button>
    </div>


  )
}

export default Index
