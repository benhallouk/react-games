class Numbers extends React.Component{
  getClass = (num) => {
  	if (this.props.selectedNumbers.indexOf(num) > -1)
    	return "selected";
    if (this.props.usedNumbers.indexOf(num) > -1) 
    	return "used"
  }
	render() {
  	return (
    	<div className="card text-center col-12">
      	<div>
      		{Numbers.list.map((num,i) => 
          	<span
            	className={this.getClass(num)}
            	onClick={() => { this.props.selectNumber(num); }}>
            	{num}
            </span>
          )}
        </div>
      </div>
    );
  }
}

Numbers.list = [1,2,3,4,5,6,7,8,9];


class Answer extends React.Component{
	render() {
  	return (
    	<div className="col-5">
          {this.props.selectedNumbers.map((num,i) => 
          	<span onClick={() => { this.props.unSelectNumber(num); }}>
            	{num}
            </span>
          )}
      </div>
    );
  }
}

class Button extends React.Component{
	render() {
    let button;
    switch(this.props.isCorrectAnswer){
      case true:
        button =       	
          <button onClick={this.props.acceptAnswer}
            className="btn btn-success">
            <i className="fa fa-check"></i>
          </button>;    
      break;
      case false:
        button =       	
          <button onClick={this.props.checkAnswer}
            className="btn btn-danger">
            <i className="fa fa-times"></i>
          </button>;    
      break;
      default:
        button =       	
          <button onClick={this.props.checkAnswer}
            className="btn"
            disabled={this.props.selectedNumbers.length===0}>
            =
          </button>;
      break;
    }
  	return (
    	<div className="col-2 text-center">
				{button}
        <br /><br />
        <button onClick={this.props.redraw}
        				className="btn btn-sm btn-warning">
          <i className="fa fa-refresh"></i> {this.props.redrawCounts}
        </button>
        <br />
      </div>
    );
  }
}

class Stars extends React.Component{    
	render() {
    const list = [];    
    for(let index=0;index<this.props.random;index++){
      list.push(<i className="fa fa-star"></i>);
    }
  	return (
    	<div className="col-5">
      	{list}
      </div>
    );
  }
}

class Result extends React.Component{
	render() {
  	return (
    	<div className="col-12 text-center">
      	<br /><br />        
          {
          	this.props.status==='win' ? 
            	<div className="col-12 alert alert-success">
              	You win!                
        			</div>:
            	<div className="col-12 alert alert-danger">
              	You lose!
        			</div>              
          }        
        	<button onClick={this.props.resetGame}
          				className="btn btn-primary">
          	Play again
          </button>
      </div>
    );
  }
}

var isPossibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

class Game extends React.Component{
	random = Math.floor(Math.random() * 9) + 1;
	state = { 
  	selectedNumbers : [],
    usedNumbers: [],
    redrawCounts: 10,
    status: null
  };
  
  resetGame = () => {
  		this.random = Math.floor(Math.random() * 9) + 1;
      
      this.setState(prevState=>({
      	isCorrectAnswer: null,
        selectedNumbers : [],
        usedNumbers: [],
        redrawCounts: 10,
        status: null
      }));  
  }
  
  selectNumber = (number) => {
  	if(this.state.usedNumbers.indexOf(number)>-1) return;
    
  	if(this.state.selectedNumbers.indexOf(number)==-1){      
      this.setState(prevState=>({
      	isCorrectAnswer: null,
        selectedNumbers : prevState.selectedNumbers.concat(number)
      }));
    }
  }
  unSelectNumber = (number) => {
  	var index = this.state.selectedNumbers.indexOf(number);
  	if(index>-1){
      this.setState(prevState=>({
      	isCorrectAnswer: null,
        selectedNumbers : prevState.selectedNumbers
        													 .filter(num=> num!==number)
      }));
    }
  }
  checkAnswer = () => {
  	this.setState(prevState=>({
    	isCorrectAnswer : this.random === prevState.selectedNumbers
      																					 .reduce((acc,n)=>acc+n,0)
    }));
  }
  
  acceptAnswer = () => {
  	this.setState(prevState=>({
    	usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      isCorrectAnswer: null
    }));
    
    this.setState(prevState=>({
    	status: prevState.usedNumbers.length === 9 ? 
      																			'win' : 
                                            this.checkIfUserLoses(prevState)
    })); 
    
    this.random = Math.floor(Math.random() * 9) + 1;
  }
  
  checkIfUserLoses = (prevState) => {  	
  	if(prevState.redrawCounts===0 && this.nothingMatches(prevState))
    	return 'lose';      	
  }
  
  nothingMatches = (prevState) => {
  	const possibleNumbers = [1,2,3,4,5,6,7,8,9]
    														.filter(num=>
                          				prevState.usedNumbers.indexOf(num)===-1);
    
    return !isPossibleCombinationSum(possibleNumbers,this.random);
  }
  
  redraw = () => {
  	if(this.state.redrawCounts==0) {return;} 
  	this.random = Math.floor(Math.random() * 9) + 1;
  	this.setState(prevState=>({
    	redrawCounts: prevState.redrawCounts-1
    }));
    
    this.setState(prevState=>({
    	status: prevState.usedNumbers.length === 9 
      																				? 'win' : 	
                                              this.checkIfUserLoses(prevState)
    }));
  }
  
	render() {
  	return (
    	<div className="row">
      	<Stars random={this.random}/>
        <Button checkAnswer={this.checkAnswer}
        				isCorrectAnswer={this.state.isCorrectAnswer}
        				selectedNumbers={this.state.selectedNumbers}                
                acceptAnswer={this.acceptAnswer} 
                redrawCounts={this.state.redrawCounts}
                redraw={this.redraw} />
        <Answer selectedNumbers={this.state.selectedNumbers}
                unSelectNumber={this.unSelectNumber} />
        {this.state.status ?
        						  <Result status={this.state.status}
                      				resetGame={this.resetGame} /> :
                      <Numbers selectNumber={this.selectNumber} 
                               selectedNumbers={this.state.selectedNumbers} 
                               usedNumbers={this.state.usedNumbers} />                    
         }
      </div>
    );
  }
}

class App extends React.Component{
	render() {
  	return (
    	<div className="container">
        <h1>Game of numbers</h1>
        <hr />                
      	<Game />
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
