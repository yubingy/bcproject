import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import faThumbtack from '@fortawesome/fontawesome-free-solid/faThumbtack'
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench'
import faMapMarker from '@fortawesome/fontawesome-free-solid/faMapMarker'
import faCertificate from '@fortawesome/fontawesome-free-solid/faCertificate'
import faHistory from '@fortawesome/fontawesome-free-solid/faHistory'

import AnnotatedSection from '../components/AnnotatedSection'
import React, { Component } from 'react'
import {connect} from 'react-redux';
import QRCode from 'qrcode.react'
import { Link } from 'react-router-dom'


import {
  Button,
  Table
} from 'reactstrap';

/*
  View component
  @description Page component that displays a product's information.
*/
class View extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      selectedCategory: "",
      holder: "",
      versionCreationDate: "",
      versions: [],
      certifications: [],
      id: "",
      customDataJson: ""
    };
  }

  componentDidMount(){
    this.fetchProduct(this.props);
  }

  fetchProduct(props){

    this.props.passageInstance.getProductById(String(props.match.params.productId).valueOf(), props.match.params.versionId ? String(props.match.params.versionId).valueOf() : "latest")
      .then((result) => {

        const certificationsArray = result[6];
        certificationsArray.map((certificationId) => {
          return this.props.passageInstance.getCertificationById(String(certificationId).valueOf())
            .then((certificationResult) => {
              const certification = {
                name: certificationResult[0],
                imageUrl: certificationResult[1],
                id: certificationId,
              }
              this.setState({certifications: [...this.state.certifications, certification]})
            });
        });

        this.setState({
          name: result[0],
          description: result[1],
          selectedCategory: result[2],
          holder: result[3],
          versionCreationDate: new Date(result[4].c * 1000).toString(),
          versions: [],
          id: props.match.params.productId,
          certifications: []
        })

    this.props.passageInstance.getProductCustomDataById(String(props.match.params.productId).valueOf(), props.match.params.versionId ? String(props.match.params.versionId).valueOf() : "latest")
      .then((result) => {
        this.setState({
          customDataJson: result
        })
      })
      .catch((error) => {
        return this.props.history.push('/');
      })

        const versionsArray = result[5];
        versionsArray.map((versionId) => {
          this.props.passageInstance.getVersionHolderById(String(versionId).valueOf())
            .then((holderResult) => {
              const version = {
                holder: holderResult,
                id: versionId,
              }
              this.setState({versions: [...this.state.versions, version]})
            });
          return false;
        });
      })
      .catch((error) => {
        return this.props.history.push('/');
      })

  }

  render() {

    const versionsList = this.state.versions.map((version, index) => {
      return (
        <li key={index}>
          <Link to={`/products/${this.props.match.params.productId}/versions/${version.id}`}>Version {index + 1} {version.holder}</Link>
        </li>
      )
    }).reverse()

    const certificationsList = this.state.certifications.map((certification, index) => {
      return (
        <div style={{display:"block", marginRight:"15px", width:"100px", height:"100px"}} key={index}>
          {<div>{certification.name}</div>}
        </div>
      )
    })

    
    const currentHolder = this.state.holder;
    
    const customData = this.state.customDataJson ? JSON.parse(this.state.customDataJson) : {};

    return (
      <div>
        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faInfoCircle}/>
              Product definition
            </div>
          }
          panelContent={
            <Table>
              <tbody>
                <tr>
                  <th scope="row">Name</th>
                  <td>{this.state.name}</td>
                </tr>
                <tr>
                  <th scope="row">Description</th>
                  <td>{this.state.description}</td>
                </tr>
                <tr>
                  <th scope="row">Main Category</th>
                  <td>{this.state.selectedCategory}</td>
                </tr>
                <tr>
                  <th scope="row">Last updated on</th>
                  <td>{this.state.versionCreationDate}</td>
                </tr>
                {
                  Object.keys(customData).map(key =>
                    <tr key={key}>
                      <th scope="row">{key}</th>
                      <td>{customData[key]}</td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
          }
        />

        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faThumbtack}/>
              Tracking information
            </div>
          }
          panelContent={
            <div>
              <QRCode value={this.props.match.params.productId}/>
              <div>
                Unique product identifier
                <pre>{this.state.id}</pre>
              </div>
            </div>
          }
        />

        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faWrench}/>
              Actions
            </div>
          }
          panelContent={
            <div>
              { this.props.match.params.versionId && this.state.versions && this.state.versions.length > 0 && this.props.match.params.versionId.toString() !== this.state.versions.slice(-1)[0].id.toString() ?
                  <Link to={"/products/" + this.props.match.params.productId}>
                    <Button color="info">
                      View latest version
                    </Button>
                  </Link>
                :
                  <Link to={"/products/" + this.props.match.params.productId + "/update"}>
                    <Button color="success">
                      Update product
                    </Button>
                  </Link>
              }
            </div>
          }
        />

        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faMapMarker}/>
              Current Holder
            </div>
          }
          panelContent={
            <div>
              {currentHolder  ? 
                <div>
                  <pre>{currentHolder}</pre>
                </div>
                :
                <p>Unable to display</p>
              }
            </div>
          }
        />

        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faCertificate}/>
              Product certifications
            </div>
          }
          panelContent={
            <div>
              {certificationsList && certificationsList.length > 0 ? certificationsList : "No Certifications to Display"}
            </div>
          }
        />
        <AnnotatedSection
          annotationContent={
            <div>
              <FontAwesomeIcon fixedWidth style={{paddingTop:"3px", marginRight:"6px"}} icon={faHistory}/>
              Version History
            </div>
          }
          panelContent={
            <div>
              <ul>
                {versionsList}
              </ul>
            </div>
          }
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    passageInstance: state.reducer.passageInstance
  };
}

export default connect(mapStateToProps)(View);
