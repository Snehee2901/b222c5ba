import React from 'react';
import Header from './Header.jsx';
import ActivityFeed from './components/activityFeed.jsx';

const App = () => {
  return (
    <div className='container' >
      <Header />
      <ActivityFeed />
    </div>
  );
};

// ReactDOM.render(<App />, document.getElementById('app'));

export default App;
