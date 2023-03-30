import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
import { BrowserRouter as Router,Switch,Route } from "react-router-dom";
export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    
    <div className="App">
        <Router>
      <Switch>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/" component={Products}/>
        <Route exact path="/checkout" component={Checkout}/>
        <Route exact path="/thanks" component={Thanks}/>
        </Switch>
    </Router>
      {/*<Login/>*/}

      
          {/*<Register />*/}
          
          
          
          
    </div>
    
  );
}

export default App;
