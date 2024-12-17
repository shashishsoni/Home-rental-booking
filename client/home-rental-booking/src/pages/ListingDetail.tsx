import Listings from '@/components/listings'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const ListingDetail = () => {
  const [loading, setLoading] = React.useState(true)
  const {listingId} = useParams()
  const [listings, setListing] = React.useState(null)

  const getlistingdetail = async () => {
    try {
      const response = await fetch(`http://localhost:3001/listing${listingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setListing(data)
      setLoading(false)
    } catch (error) {
      console.log('Error fetching listing:', (error as any).message)
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!listings) {
    return <div>Error loading listing details</div>; 
  }

  useEffect(() => {
    getlistingdetail()
  }, [])

  return (
    <div>
      <div>
        <h1>{listings.title}</h1>
        <div></div>
      </div>
      <div>
        {listings.listingPhotoPaths?.map((item: any) => (
          <img
            key={item}
            src={`http://localhost:3001/${item.replace('public', '')}`}
            alt="listingImg"
          />
        ))}
      </div>

      <div>
        <h2>
          {listings.type} is in {listings.city}, {listings.province}, {listings.country}
        </h2>
        <p>{listings.guestCount} guest - {listings.bedroomCount} bedroom - {listings.bedCount} bed(s) - {listings.bathroomCount} bathroom</p>
      </div>
      <hr />
      <div className=''>
        <img src={`http://localhost:3001/${listings.creator.profileImagePath.replace("public", "")}`} alt="" />
        <h3>Hosted by {listings.creator.firstname} {listings.creator.lastname}</h3>
      </div>

      <hr />
      <h3 className=''>Description</h3>
      <p>{listings.description}</p>

      <hr />
      <h3 className=''>{listings.highlight}</h3>
      <p className=''>{listings.highlightDescription}</p>
    </div>
  );
};

export default ListingDetail
