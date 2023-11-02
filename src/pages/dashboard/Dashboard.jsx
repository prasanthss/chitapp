import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import Swal from "sweetalert2";
import ConfigData from '../../../config.json'
import Button from 'react-bootstrap/Button';
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import Form from 'react-bootstrap/Form';
import ReactToPrint from "react-to-print";
import Table from 'react-bootstrap/Table';

function Dashboard() {
  //debugger;
  const componentRef = useRef();
  const [rcNumber, setrcNumber] = useState('0');
  const [disableButton, setdisableButton] = useState(true);
  const [disablePrintButton, setdisablePrintButton] = useState(true);

  const [userDetails, setuserDetails] = useState();
  const [arnRadio, setarnRadio] = useState("ARNnumber");
  const [arnNumber, setarnNumber] = useState("");
  const [grpchitName, setchitgrpName] = useState("");
  const [ticketchitNumber, setticketchitNumber] = useState("");
  const [penaltyData, setPenaltyData] = useState(null);
  //add amount 
  const [addAmount, setaddAmount] = useState("");
  const [addRemarks, setaddRemarks] = useState("");
  const [addtypePayment, setaddtypePayment] = useState("");

  const [errorAmt, setErrorAmt] = useState('');
  const [errorRemarks, setErrorRemarks] = useState('');
  const [erroraddtypePayment, setErroraddtypePayment] = useState('');

  const [paymentHistoryData, setpaymentHistoryData] = useState([]);
  const [totalDue, settotalDue] = useState(0);
  const [totalprePenaltyAmout, settotalprePenaltyAmout] = useState(0);
  const [totalpendingAmount, settotalpendingAmount] = useState(0);

  const [totalpenaltyAmount, settotalpenaltyAmount] = useState(0);
  
  const [totalpaidAmount, settotalpaidAmount] = useState(0);

  const [totaldueAmount, settotaldueAmount] = useState(0);
  
  
  

  

  let [arnDetails, setarnDetails] = useState();

  const handleOptionChange = (event) => {
    setarnRadio(event.target.value);
    console.log(event.target.value);
  };

  const calculateSum = (array, property) => {
    const total = array.reduce((accumulator, object) => {
      // Remove commas and convert the property value to a number
      const numericValue = parseFloat(object[property].replace(/,/g, ''));
  
      // Check if the numericValue is a valid number
      if (!isNaN(numericValue)) {
        return accumulator + numericValue;
      } else {
        return accumulator; // Ignore invalid values
      }
    }, 0);
  
    return total;
  };

  //get info button
  const generateArnInfo = () => {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: ConfigData.API_ENDPOINT + `Payment/GetCollectioninfoByArnNo?type=${arnRadio}&ARNoN=${arnNumber}`,
      headers: {}
    };

    axios.request(config)
      .then((response) => {

        if (response.data.grp_Series_vc == null) {
          setarnDetails(response.data);
          
          
          setdisableButton(true);
        }
        else {
          setdisableButton(false);
        }

      })
      .catch((error) => {
        setdisableButton(true);
        setdisablePrintButton(true);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'No Data Found',
          text: 'Please try again...',
          showConfirmButton: false,
          timer: 2000,
          width: 350,
        });

      });

  }


  //generate chit info
  const generateChitInfo = () => {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: ConfigData.API_ENDPOINT + `Penalty/Getpenalty?GroupName=${grpchitName}&TktNo=${ticketchitNumber}`,
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setarnDetails(response.data)
      if(response.data.installmentwiseOthersList!=null)
      {
        settotalDue(calculateSum(response.data.installmentwiseOthersList,'total'));
        settotalprePenaltyAmout(calculateSum(response.data.installmentwiseOthersList,'prePenaltyAmout'));
        settotalpendingAmount(calculateSum(response.data.installmentwiseOthersList,'pendingAmount'));
        settotalpenaltyAmount(calculateSum(response.data.installmentwiseOthersList,'penaltyAmount'));
        settotalpaidAmount(calculateSum(response.data.installmentwiseOthersList,'paidAmount'));
        settotaldueAmount(calculateSum(response.data.installmentwiseOthersList,'dueAmount'));

        

       // settotalprePenaltyAmout(response.data.installmentwiseOthersList,'prePenaltyAmout');
        //settotalpendingAmount(response.data.installmentwiseOthersList,'pendingAmount');
      }
        
        setdisableButton(false);
      })
      .catch((error) => {
        console.log(error,"generateChitInfo")
        setdisableButton(true);
        setdisablePrintButton(true);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'No Data Found',
          text: 'Please try again...',
          showConfirmButton: false,
          timer: 2000,
          width: 350,
        });

      });

  }

  const addAmountSubmit = (e) => {

    e.preventDefault();
    if (!addtypePayment || addtypePayment <= 0) {
      setErroraddtypePayment('Please select a payment.')
      return
    }
    setErroraddtypePayment('');
    if (!addAmount || isNaN(addAmount) || addAmount <= 0) {
      setErrorAmt('Please enter a valid amount.')
      return
    }
    setErrorAmt('');
    if (!addRemarks || addRemarks <= 0) {
      setErrorRemarks('Please enter a Remarks.')
      return
    }
    setErrorRemarks('');

    let groupNaname = "AR";
    let cusTktNoI = arnDetails.aR_No_n;
    if (arnRadio == "Chit") {
      groupNaname = arnDetails.grp_Series_vc;
      cusTktNoI = ticketchitNumber;
    }


    let data = JSON.stringify({
      "ChitType": arnRadio,
      "machineIdVc": ConfigData.SOURCE,
      "cusIdN": arnDetails.cus_ID_n,
      "cusNameVc": arnDetails.cus_Name_vc,
      "grpNameVc": groupNaname,
      "cusTktNoI": cusTktNoI,
      "recSeriesVc": ConfigData.SOURCE,
      "recPenaltyN": 0,
      "recDcamountN": 0,
      "recPsamountN": 0,
      "recEntranceFeeN": 0,
      "recAmountN": addAmount,
      "recTypeVc": addtypePayment,
      "accountCodeN": 0,
      "chqNoN": 0,
      "chqDateD": null,
      "chqBankVc": "",
      "empIdI": 1,
      "recRemarkVc": addRemarks,
      "userIdVc": userDetails.employeeProfile.loginUserIdVc,
      "recTransVc": "no",
      "recTransNoN": 0,
      "cusCancelNoN": 0,
      "updatedDateD": null,
      "recVerifiedVc": "no",
      "paidInstNoN": 0,
      "yearSeriesN": 0,
      "recVerifiedByVc": "no",
      "recVerifiedDateD": null,
      "brnIdVc": "Stp",
      "tallyVoucherVc": "no",
      "tallyVoucherD": null,
      "chqReleasedDateD": null,
      "chqReleasedByVc": "",
      "chqClearedDateD": null,
      "chqClearedByVc": ""
    });


    console.log(data, "data");
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: ConfigData.API_ENDPOINT + `Payment/AddPayment`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        if (response.data.msg == "success") {
          setdisableButton(true);
          setdisablePrintButton(false);
          setrcNumber(response.data.rec_Number_n);
          getPaymentHitory(userDetails.employeeProfile.loginUserIdVc);

          if (arnRadio == "Chit") {
            generateChitInfo();
          }
          else {
            generateArnInfo();
          }


          setTimeout(() => {
            document.getElementById('reactPrint').click();
          }, 1000);


        }


      })
      .catch((error) => {
        setdisableButton(true);
        setdisablePrintButton(true);
      });


  }
  useEffect(() => {
    const storeduserData = sessionStorage.getItem('userInfo');

    if (storeduserData) {
      setuserDetails(JSON.parse(storeduserData));
      setTimeout(() => {
        let userParseData = JSON.parse(storeduserData);
        getPaymentHitory(userParseData.employeeProfile.loginUserIdVc);
      }, 2000);
    }

    //get payment history



  }, [])

  //click reload
  const clickReload = () => {
    window.location.reload();
  }

  

  const getPaymentHitory = (userID) => {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: ConfigData.API_ENDPOINT + `Payment/paymenthistory/${userID}`,
      headers: {}
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setpaymentHistoryData(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  }


  return (

    <>
      <Header />
      <div className='chitfundbox bg-grey spacall'>
        <div className="container">
          <div className="arnnumberbox-details mx-auto">
            <div className="ftbox-common shadow-md">
              <div className="explicitvox spaclt">
                <div className="sd lh">
                  <div className="wc">
                    <h4 className="mb-0"> Details below
                    </h4>
                  </div>
                </div>
              </div>
              <div className="spaclt">
                <Form>
                  <Form.Group className="mb-3" >
                    <Form.Label htmlFor="infolabel">Choose information</Form.Label>
                    {['radio'].map((type) => (
                      <div key={`inline-${type}`}>
                        <Form.Check onChange={handleOptionChange}
                          inline
                          label="ARN number"
                          value="ARNnumber"
                          name="group1"
                          type={type}
                          id={`inline-${type}-1`}
                          checked={arnRadio === 'ARNnumber'}
                        />
                        <Form.Check onChange={handleOptionChange}
                          inline
                          label="Chit"
                          name="group1"
                          value="Chit"
                          type={type}
                          id={`inline-${type}-2`}
                          checked={arnRadio === 'Chit'}
                        />

                      </div>
                    ))}
                  </Form.Group>
                  {arnRadio === 'ARNnumber' &&
                    <>
                      <Form.Group className="mb-3" >
                        <Form.Label >
                          ARN Number
                        </Form.Label>
                        <Form.Control type="text" placeholder="ARN Number" onChange={(e) => setarnNumber(e.target.value)} />
                      </Form.Group>
                      <Button type="button" className="btn btn-primary" onClick={generateArnInfo}>ARN Info</Button>
                    </>
                  }

                  {arnRadio === 'Chit' &&
                    <>
                      <Form.Group className="mb-3" >
                        <Form.Label >
                          Group Name
                        </Form.Label>
                        <Form.Control type="text" placeholder="Group Name" onChange={(e) => setchitgrpName(e.target.value)} />
                      </Form.Group>
                      <Form.Group className="mb-3" >
                        <Form.Label >
                          Ticket Number
                        </Form.Label>
                        <Form.Control type="text" placeholder="Ticket Number" onChange={(e) => setticketchitNumber(e.target.value)} />
                      </Form.Group>
                      <Button type="button" className="btn btn-primary" onClick={generateChitInfo}>Get Chit Info</Button>
                    </>
                  }


                </Form>
              </div>
            </div>

            {arnRadio === 'Chit' && arnDetails ?
              <div className="mt-3">
                <div className="card table-responsive ">
                  <Table striped >
                    <thead>
                      <tr>
                        <th>Install No</th>
                        <th>Auc Date</th>
                        <th>DueDate</th>
                        <th>Pending Day</th>
                        <th>Due Amount</th>
                        <th>Paid Amount</th>
                        <th>Pre Penalty Amount</th>
                        <th>Penalty Amount</th>
                        <th>Pending Amount</th>
                        <th>Todal</th>
                      </tr>
                    </thead>
                    <tbody>

                      {arnDetails.installmentwiseOthersList ? (
                        arnDetails.installmentwiseOthersList.map((item) => (
                          <tr key={item.instNo}>
                            <td>{item.instNo}</td>
                            <td>{item.aucDate}</td>
                            <td>{item.dueDate}</td>
                            <td>{item.pendingDay}</td>
                            <td>{item.dueAmount}</td>
                            <td>{item.paidAmount}</td>
                            <td>{item.prePenaltyAmout}</td>
                            <td>{item.penaltyAmount}</td>
                            <td>{item.pendingAmount}</td>
                            <td>{item.total}</td>
                            {/* Add more cells for other data properties */}
                          </tr>


                        ))
                      ) : (
                        <tr>
                          <td colSpan="10">No data available</td>
                        </tr>
                      )}
                      {/* Display the sum in a separate row at the bottom of the table */}
                      <tr>
                        <td colSpan="4">Total Pending:</td>
                        <td>{totaldueAmount}</td>
                        <td>{totalpaidAmount}</td>
                        <td>{totalprePenaltyAmout}</td>
                        <td>{totalpenaltyAmount}</td>
                        <td>{totalpendingAmount}</td>
                        <td>{totalDue}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </div>

              : ""}

            {arnDetails ?
              <div className="userinfo-get mt-4">
                <h4 className='mb-4'>User information</h4>
                <div className="d-grid fourbox-grid gap-3">
                  <div className="frboxitems shadow-md">
                    <div className="spaclt">
                      <p className='mb-2'>Customer id</p>
                      <div className="customergetinfoapi fw-bold mb-0">
                        # <span>{arnDetails && arnDetails.cus_ID_n}</span>
                      </div>
                    </div>
                  </div>
                  <div className="frboxitems shadow-md">
                    <div className="spaclt">
                      <p className='mb-2'>Customer name</p>
                      <div className="customergetinfoapi fw-bold  mb-0">
                        {arnDetails && arnDetails.cus_Name_vc}
                      </div>
                    </div>
                  </div>
                  <div className="frboxitems shadow-md">
                    <div className="spaclt">
                      <p className='mb-2'>Occupation</p>
                      <div className="customergetinfoapi fw-bold mb-0">
                        {arnDetails && arnDetails.cus_Occupation_vc}
                      </div>
                    </div>
                  </div>
                  <div className="frboxitems shadow-md">
                    <div className="spaclt">
                      <p className='mb-2'>Recived amount</p>
                      <div className="customergetinfoapi fw-bold mb-0">
                        ₹ <span>{arnDetails && arnDetails.receivedAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              : ""}


            <div className="ftbox-common mt-4 shadow-md">
              <div className="explicitvox spaclt">
                <div className="sd lh">
                  <div className="wc">
                    <h4 className="mb-0"> Payable amount
                    </h4>
                  </div>
                </div>
              </div>
              <div className="spaclt">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Type of payment</Form.Label>
                    <Form.Select onChange={(e) => setaddtypePayment(e.target.value)}>
                      <option value="">Select Type of payment</option>
                      <option value={'Cash'}>Cash</option>
                      <option value={'Online'}>Online payment</option>
                    </Form.Select>
                    {erroraddtypePayment && <div className='error'>{erroraddtypePayment}</div>}
                  </Form.Group>
                  <Form.Group className="mb-3" >
                    <Form.Label >
                      Enter amount
                    </Form.Label>

                    <Form.Control type="text" placeholder="Amount" onChange={(e) => setaddAmount(e.target.value)} />
                    {errorAmt && <div className='error'>{errorAmt}</div>}
                  </Form.Group>

                  <Form.Group className="mb-3" >
                    <Form.Label >
                      Remarks
                    </Form.Label>

                    <Form.Control type="text" placeholder="Remarks" onChange={(e) => setaddRemarks(e.target.value)} />
                    {errorRemarks && <div className='error'>{errorRemarks}</div>}
                  </Form.Group>

                  <div className="groupsbtn-d d-flex gap-2">

                    <Button disabled={disableButton} className="btn btn-primary" onClick={addAmountSubmit}>Submit</Button>
                    <ReactToPrint
                      trigger={() => {
                        return (
                          <Button disabled={disablePrintButton} id="reactPrint" type="button" variant="light">
                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-printer me-2" viewBox="0 0 16 16">
                              <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
                              <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z" />
                            </svg> Print
                          </Button>
                        )
                      }}
                      content={() => componentRef.current}
                    />

                  </div>

                </Form>
              </div>
            </div>

            <div className="ticket-print mt-4 d-print-block d-none" ref={componentRef}>
              <h6 className='centered'>
                Agnishwari Chit fund PVT LTD
              </h6>
              <p className='centered'>Sethiyathope <br />Chits Collection Reciept</p>
              <table align='center'>
                <tbody>
                  <tr>
                    <td className="quantity">{new Date().toLocaleDateString()}</td>
                    <td className="description">{new Date().toLocaleTimeString()}</td>
                  </tr>
                  <tr>
                    <td className="quantity">RECIPT NO.</td>
                    <td className="description">{rcNumber}</td>
                  </tr>
                  <tr>
                    <td className="quantity">GRP NAME.</td>
                    <td className="description">{arnDetails && arnDetails.grp_Series_vc}</td>
                  </tr>
                  <tr>
                    <td className="quantity">CUST NAME.</td>
                    <td className="description">{arnDetails && arnDetails.cus_Name_vc}</td>
                  </tr>
                  <tr>
                    <td className="quantity">CHIT VALUE</td>
                    <td className="description">50000</td>
                  </tr>
                  {arnRadio === 'Chit' &&
                    <tr>
                      <td className="quantity">INST NO.</td>
                      <td className="description">Currnt 8 Paid</td>
                    </tr>
                  }

                  <tr>
                    <td className="quantity">PAYABLE</td>
                    <td className="description">RS . <span>116060.00</span></td>
                  </tr>

                  <tr>
                    <td className="quantity">PAID AMT</td>
                    <td className="description">RS . <span>101740.00</span></td>
                  </tr>
                  {arnRadio === 'Chit' &&
                    <tr>
                      <td className="quantity">PENDING</td>
                      <td className="description">RS . <span>14320.00</span></td>
                    </tr>
                  }

                  <tr>
                    <td className="quantity">COLL AMT</td>
                    <td className="description">RS . <span>14320.00</span></td>
                  </tr>
                  {arnRadio === 'Chit' &&
                    <tr>
                      <td className="quantity">BALANCE</td>
                      <td className="description">RS . <span>0.00</span></td>
                    </tr>
                  }
                </tbody>
              </table>
              <br />
              <p className="centered fw-500">Thank you</p>

              <table align='center'>
                <tbody>
                  <tr>
                    <td className="quantity">{userDetails && userDetails.employeeProfile.loginUserIdVc}</td>
                    <td className="description">Sign</td>
                  </tr>
                  <tr>
                    <td className="quantity">&nbsp;</td>
                    <td className="description">&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            </div>


            <div className="ftbox-common mt-4 shadow-md">
              <div className="uh gi zm">
                <div className="transactoionbox spaclt ps-0">
                  <div>
                    <p className="fw-bold mb-1">Payment history</p>
                    <p className="vb ej jj sj">Your payment history defaults to the detailed transaction view.</p>
                  </div>
                </div>
              </div>
              <div className="uf vf">

                {paymentHistoryData.map((item, index) => (
                  <div className="arndetailbox-items d-grid" key={index}>
                    <div className="db uh mp an qo">
                      <span className="fg-circle sccesscircle">
                        <svg className="mb hc gd xd zj" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx={4} cy={4} r={3} />
                        </svg>
                        Completed
                      </span>
                    </div>
                    <div className='uh mp an oo' >{item.name}</div>
                    <div className='uh mp an oo' >{item.paymentCollectedDate}</div>
                    <div className='uh mp an oo' >{item.grp_Name_vc}</div>
                    <div className='uh mp an oo' >	&#8377; {item.rec_Amount_n} <span>({item.rec_Type_vc})</span></div>
                  </div>
                ))}




              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fiexrefresh">
        <a className='btn btn-light' id='clickReload' onClick={clickReload}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            enableBackground="new 0 0 512 512"
            viewBox="0 0 24 24"
          >
            <path
              d="M20.496 11.158a8.004 8.004 0 11-2.692-5.18l-1.415.007a1 1 0 00.005 2h.006l3.606-.02A1 1 0 0021 6.962l-.02-3.605a.966.966 0 00-1.006-.995 1 1 0 00-.994 1.005l.005.997a9.99 9.99 0 103.499 6.586 1 1 0 10-1.988.209z"
              data-name="Layer 79"
              data-original="#ccc"
            ></path>
          </svg> Reload
        </a>
      </div>
      <Footer />
    </>
  )
}

export default Dashboard