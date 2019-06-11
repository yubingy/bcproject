import AnnotatedSection from '../components/AnnotatedSection'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faStar from '@fortawesome/fontawesome-free-solid/faStar'

import React, { Component } from 'react'
import {connect} from 'react-redux';
import { Link } from 'react-router-dom'
import { Button, FormGroup, Label, Input } from 'reactstrap';


/*
  "Create" component
  @description Page component that allows creating a new product
*/
class Create extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      description: '',
      selectedCategory: '',
      holder: '',
      availableCertifications: [],
      selectedCertifications: {},
      customDataInputs: {},
      buttonDisabled: false,
    }
  }

  componentDidMount(){
    this.props.passageInstance.getActorCertificationsIds({from: this.props.web3Accounts[0]})
      .then((result) => {
        result.map((certificationId) => {
          return this.props.passageInstance.getCertificationById(String(certificationId).valueOf())
            .then((result) => {
              const certification = {
                name: result[0],
                imageUrl: result[1],
                id: certificationId,
              }
              return this.setState({availableCertifications: [...this.state.availableCertifications, certification]})
            });
        });
      })
  }

  handleChange = (e) => {
    const certificationId = e.target.name;
    this.setState({selectedCertifications: {...this.state.selectedCertifications, [certificationId]: e.target.checked}})
  }

  handleCategorySelect = (event) => {
    this.setState({selectedCategory: event.target.value});
  }

  appendInput(key = "", value = "") {
    var newInputKey = `input-${Object.keys(this.state.customDataInputs).length}`; 
    this.setState({ customDataInputs: {...this.state.customDataInputs, [newInputKey]: {key: key, value: value} }});
  }
  
  handleCreateNewProduct = () => {

    const selectedCertifications = this.state.selectedCertifications;
    const certificationsArray = [];
    Object.keys(selectedCertifications).map(key => {
      if(selectedCertifications[key] === true){
        return certificationsArray.push(key)
      }
      return false;
    })

    var customDataObject = {}
    Object.keys(this.state.customDataInputs).map(inputKey => {
      const input = this.state.customDataInputs[inputKey]
      if(input.key.trim() !== "" && input.value.trim() !== ""){
        customDataObject[input.key] = input.value;
      }
      return false;
    })


    this.props.passageInstance.createProduct(this.state.name, this.state.description, this.state.selectedCategory, this.state.holder, certificationsArray, JSON.stringify(customDataObject), {from: this.props.web3Accounts[0], gas:1000000})
      .then((result) => {
      })
  }

  

  render() {

    return (
      <div>
        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faStar}/>
              Product information
            </div>
          }
          panelContent={
            <div>
              <FormGroup>
                  <Label>Name</Label>
                  <Input placeholder="Product name" value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}}></Input>
              </FormGroup>
              <FormGroup>
                  <Label>Description</Label>
                  <Input placeholder="Product description" value={this.state.description} onChange={(e) => {this.setState({description: e.target.value})}}></Input>
              </FormGroup>
              <FormGroup>
                  <Label>Current holder</Label>
                  <Input placeholder="Product holder" value={this.state.holder} onChange={(e) => {this.setState({holder: e.target.value})}}></Input>
              </FormGroup>
              <FormGroup>
                  <Label>Main Category</Label>
                  <Input defaultValue="" type="select" name="select" id="exampleSelect" onChange={(e) => this.handleCategorySelect(e)}> 
                    <option value="" >(select)</option>
                    <option value="Home Improvement Systems" >Home Improvement Systems</option>
                    <option value="Framing Systems" >Framing Systems</option>
                    <option value="Curtain Walls" >Curtain Walls</option>
                    <option value="Louvres" >Louvres</option>
                    <option value="Security Windows and Doors" >Security Windows and Doors</option>
                    <option value="Windows" >Windows</option>
                    <option value="Doors" >Doors</option>
                    <option value="Shower and Wardrobes" >Shower and Wardrobes</option>
                    <option value="Thermal Break" >Thermal Break</option>
                  </Input>
              </FormGroup>
              <FormGroup>
                <Label>Certification(s)</Label>
                <Link style={{marginLeft: "10px"}} to="/createcertification">Create Certifications</Link>
                <div>
                  {
                    this.state.availableCertifications && this.state.availableCertifications.length > 0 ?
                      this.state.availableCertifications.map((certification, index) => 
                        <div key={index}>
                          <input style={{marginRight: "5px"}} onChange={this.handleChange} name={certification.id} type="checkbox"></input>
                          <span>{certification.name}</span>
                        </div>
                      )
                      :
                      <div style={{marginLeft:"15px"}}>
                        No certifications to Display
                      </div>
                  }
                </div>
              </FormGroup>
              <FormGroup>
                {
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
              <Button disabled={this.state.buttonDisabled} color="primary" onClick={this.handleCreateNewProduct}>Create product</Button>
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

export default connect(mapStateToProps)(Create);
