const Card = (props) => {
	return (
  	<div>
    	<img width="75" src={props.avatar_url} />
      <div>{props.name}</div>
      <div>{props.company}</div>
    </div>
  );
};

const CardList = (props) => {
	return (
  	<div>
    	{props.cards.map(card => <Card key={card.id} {...card}/>)}
    </div>
  );
};

class Form extends React.Component {
	state = {userName : ""};
  
  handleOnSubmit = (event) => {
  	event.preventDefault();
    fetch(`https://api.github.com/users/${this.state.userName}`)
    		.then((resp) => {
          resp.json().then((json) => {
          	this.setState({ userName : "" });
          	this.props.onSubmit(json);
          });
        });
  };
  
  render() {
  	return (
      <form onSubmit = {this.handleOnSubmit}>
        <input type="text" 
        value = {this.state.userName}
        onChange = {(event)=>{this.setState({ userName:event.target.value });}}
        placeholder="enter username" />
        <button type="submit">Add</button>
      </form>
    );
  };	
};

class App extends React.Component{
	state = {
  	cards : []
  };
  
  addCard = (data) => {
  	this.setState(prevState => ({
    	cards : prevState.cards.concat(data)
    }));
  };
  
	render() {
  	return (
    	<div>
    		<Form onSubmit={this.addCard}/>
    		<CardList cards={this.state.cards} />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
