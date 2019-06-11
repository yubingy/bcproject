import AnnotatedSection from '../components/AnnotatedSection'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faArrowAltCircleUp from '@fortawesome/fontawesome-free-solid/faArrowAltCircleUp'

import React, { Component } from 'react'
import {connect} from 'react-redux';
import { Link } from 'react-router-dom'


import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

/*
  Update component
  @description Page component used to update a product's information.
*/
class Update extends Component {

  constructor(props) {
    super(props)

    this.state = {
      holder: '',
      updateButtonDisabled: false,
      customDataInputs: {}
    }
  }

  componentDidMount() {
    
    this.params = this.props.match.params;
    this.props.passageInstance.getProductCustomDataById(String(this.params.productId).valueOf(), this.params.versionId ? String(this.params.versionId).valueOf() : "latest")
      .then((result) => {
        const customData = JSON.parse(result);
        Object.keys(customData).map(dataKey => {
          const inputKey = this.appendInput();
          this.setState({
            customDataInputs: {...this.state.customDataInputs, [inputKey]: {key: dataKey, value: customData[dataKey]}}
          })
          return false;
        })
      })
      .catch((error) => {
        return this.props.history.push('/');
      })
  }

  handleUpdateProduct = () => {
    var customDataObject = {}
    Object.keys(this.state.customDataInputs).map(inputKey => {
      const input = this.state.customDataInputs[inputKey]
      if(input.key.trim() !== "" && input.value.trim() !== ""){
        customDataObject[input.key] = input.value;
      }
      return false;
    })

    this.props.passageInstance.updateProduct(String(this.params.productId).valueOf(), this.state.holder, JSON.stringify(customDataObject), {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
        this.props.history.push('/products/' + this.params.productId);
      })
  }

  appendInput() {
    var newInputKey = `input-${Object.keys(this.state.customDataInputs).length}`; 
    this.setState({ customDataInputs: {...this.state.customDataInputs, [newInputKey]: {key: "", value: ""} }});
    return newInputKey;
  }

  
  
  render() {

    return (
      <div>
        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faArrowAltCircleUp}/>
              New information
            </div>
          }
          panelContent={
            <div>
              <FormGroup>
              <Label>Current holder</Label>
                  <Input placeholder="Product holder" value={this.state.holder} onChange={(e) => {this.setState({holder: e.target.value})}}></Input>
              </FormGroup>
              <FormGroup>
                {
                  // for every custom data field specified in the component state,
                  // render an input with the appropriate key/value pair
                  Object.keys(this.state.customDataInputs).map(inputKey =>
                    <FormGroup style={{display:"flex"}} key={inputKey}>
                      <Input value={this.state.customDataInputs[inputKey].key} placeholder="Properties for Capral/Comment for Customer" style={{flex: 1, marginRight:"15px"}} onChange={(e) => {this.setState({ customDataInputs: {...this.state.customDataInputs, [inputKey]: {...this.state.customDataInputs[inputKey], key: e.target.value} }})}}/>
                      <Input value={this.state.customDataInputs[inputKey].value} placeholder="Value of Properties/Content of Comment" style={{flex: 1}} onChange={(e) => {this.setState({ customDataInputs: {...this.state.customDataInputs, [inputKey]: {...this.state.customDataInputs[inputKey], value: e.target.value} }})}}/>
                    </FormGroup>
                  )
                }
                <Link to="#" onClick={ () => this.appendInput() }>
                  Create User-defined Attributes
                </Link>
              </FormGroup>
              <Button disabled={this.state.updateButtonDisabled} color="primary" onClick={this.handleUpdateProduct}>Update</Button>
            </div>
          }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    passageInstance: state.reducer.passageInstance,
    web3Accounts: state.reducer.web3Accounts
  };
}

export default connect(mapStateToProps)(Update);
