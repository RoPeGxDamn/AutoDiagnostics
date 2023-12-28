import React, { useEffect, useState } from 'react';
import FeedbackList from '../components/FeedbackList';
import { instance } from '../api/axios';

export default function About() {
  const [reviews, setReviews] = useState()
  const getReviews = async () => {
    await instance.get('feedback').catch(err => console.log(err)).then(res => {
      if(res) {
        setReviews(res.data.data)
      }
    })
  }

  useEffect(() => {
    getReviews()
  }, [])

  return (
    <div className='mt-2' style={{height: '600px', overflow: 'scroll'}}>
      <h4> Our Mission</h4>
      <div className="p-3">
        At <strong>AutoDiagnostics</strong>, our mission is to provide exceptional automotive
        services with a commitment to quality, reliability, and customer
        satisfaction. We strive to be your trusted partner in vehicle
        maintenance and repairs, ensuring your safety on the road.
      </div>
      <h4>Who We Are</h4>
      <div className="p-3">
        Founded in 2023, <strong>AutoDiagnostics</strong> is a leading automotive service
        provider dedicated to delivering top-notch solutions for all your
        vehicle needs. With a team of highly skilled technicians and a passion
        for cars, we take pride in offering comprehensive services that keep
        your vehicle running smoothly.
      </div>
      <h4>Why Choose Us</h4>
      <div className="p-3">
        Our team of certified technicians brings a wealth of experience and
        expertise to the table. Whether it's routine maintenance, diagnostics,
        or complex repairs, we have the knowledge and skills to handle it all.
        We stay updated on the latest industry trends and technologies to
        provide cutting-edge solutions for modern vehicles.
      </div>
      <h4>Our Values</h4>
      <ul>
        <li>
          Integrity: We operate with honesty and transparency in all our
          dealings.
        </li>
        <li>
          Reliability: Count on us to deliver consistent, dependable services.
        </li>
        <li>
          Community: We are proud to be a part of the Minsk community and
          actively contribute to its well-being.
        </li>
      </ul>
      <h4>Visit Us Today</h4>
      <div className="p-3">
        Discover the <strong>AutoDiagnostics</strong> difference. Visit our conveniently located
        auto service center at Mayk 140, 23/2 or give us a call at
        +375445645500. We look forward to serving you and your vehicle!
      </div>
      <div className='p-3'>
        <h4>Reviews</h4>
        <FeedbackList feedback={reviews}/>
      </div>
    </div>
  );
}
