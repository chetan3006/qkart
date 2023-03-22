import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import Login from "./components/Login";
import Products from "./components/Products";
import { BrowserRouter as Router,Switch,Route } from "react-router-dom";
export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <Router>
      <Switch>
    <div className="App">
      
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/" component={Products}/>
      
      {/*<Login/>*/}

      
          {/*<Register />*/}
          
          
          
          
    </div>
    </Switch>
    </Router>
  );
}

export default App;
