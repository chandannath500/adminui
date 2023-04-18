import './App.css';
import User from "./components/User"
export const config = {
   endpoint:`https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`
};
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <User />
      </header>
    </div>
  );
}

export default App;
