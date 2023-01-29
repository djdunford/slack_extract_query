import React from 'react';
import './App.css';
import {SlackItem} from "./models/SlackItem";
import Table from 'react-bootstrap/Table';
import { API } from 'aws-amplify';
import { withAuthenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';

interface Params {
  baseUrl?: string;
  headers?: any;
  method?: string;
  response?: boolean;
}

const getConfig: Params = {
  headers: {
  },
  response: true,
}

export const getApi = async (url: string): Promise<any> => {
  return API.get("slackquery", url, getConfig)
  .then((response)=> {
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

function App({ signOut, user}: any) {  // TODO: remove use of any

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
      <>
        <h1>Hello {user.username}</h1>
        <button onClick={signOut}>Sign out</button>
      </>
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

export default withAuthenticator(App);
