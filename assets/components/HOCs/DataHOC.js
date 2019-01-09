import React from 'react';


export const DataContext = React.createContext('data');

export function withData(Component) {
  return function (props) {
    return (
      <DataContext.Consumer>
        {data => <Component data={data} {...props} />}
      </DataContext.Consumer>
    );
  }
}
