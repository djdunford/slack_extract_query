import React from 'react';
import './App.css';
import axios from "axios";
import {SlackItem} from "./models/SlackItem";
import Table from 'react-bootstrap/Table';

interface Params {
  baseUrl: string;
  headers: any;
  method: string;
}

const getConfig: Params = {
  baseUrl: "https://reowwnul6h.execute-api.eu-west-2.amazonaws.com/Prod/",
  headers: {
    Authorization: undefined
  },
  method: "get",
}

export const getApi = async (url: string): Promise<any> => {
  return await axios({
    ...getConfig,
    url: `${getConfig.baseUrl}/${url}`,
  }).then((response)=> {
    console.log(response)
    return {
      status: response.status,
      data: response.data,
    }
  }).catch((error) => {
    console.log(error)
    return {
      status: error.status,
      data: error.response,
    }
  })
}

function App() {

  const [data, setData] = React.useState([])
  const getData = () => getApi("hello").then((res) => {
    if (res.status === 200) {
      setData(res.data)
      console.log(data)
    } else {
      console.log(res)
    }
  })

  React.useEffect(() => {
    getData()
  }, [])

  return (
    <div className="App">
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th style={{width: '200px'}}>Date/Time</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((item: SlackItem) =>
              <tr>
                <td>{item.ts.toString()}</td>
                <td>{item.text.toString()}</td>
              </tr>
            )
          }
        </tbody>
      </Table>
    </div>
  );
}

export default App;
