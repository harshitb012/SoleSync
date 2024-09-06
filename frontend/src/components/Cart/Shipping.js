import React, { useState, useEffect } from 'react'
import MetaData from '../MetaData'
import PinDropIcon from '@material-ui/icons/PinDrop'
import HomeIcon from '@material-ui/icons/Home'
import PhoneIcon from '@material-ui/icons/Phone'
import LocationCityIcon from '@material-ui/icons/LocationCity'
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation'
import { State, City } from 'country-state-city'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import './Shipping.css'
import CheckOutStep from './CheckOutStep'
import { useNavigate } from 'react-router-dom'
import { saveShippingInfo } from '../../actions/cartAction'
const Shipping = () => {
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const alert = useAlert()
  const { shippingInfo } = useSelector((state) => state.cart)

  const [address, setAddress] = useState(shippingInfo?.address || '')
  const [city, setCity] = useState(shippingInfo?.city || '')
  const [state, setState] = useState(shippingInfo?.state || '')
  const [pincode, setPinCode] = useState(shippingInfo?.pinCode || '')
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo || '')

  const [country ,setCountry]=useState( 'IN')

  
  const states = State.getStatesOfCountry(country)
  const cities = state ? City.getCitiesOfState(country, state) : []

  const shippingSubmit = (e) => {
    e.preventDefault()
    if (phoneNo.length < 10 || phoneNo.length > 10) {
        alert.error("Phone Number should be 10 digits Long");
        return;
      }
      dispatch(
        saveShippingInfo({ address, city, state, pinCode: pincode, phoneNo,country})
      );
      navigate("/order/confirm");
    };
   
   
  

  return (
    <>
      <MetaData title="Shipping Details" />

       <CheckOutStep activeStep={0}/>


      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>
          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div>
              <HomeIcon />
              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div>
              <TransferWithinAStationIcon/>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <LocationCityIcon />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <PinDropIcon />
              <input
                type="number"
                placeholder="Pincode"
                required
                value={pincode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
            
            <div>
              <PhoneIcon />
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                size="10"
              />
            </div>

            
            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
            />
          </form>
        </div>
      </div>
    </>
  )
}


export default Shipping
