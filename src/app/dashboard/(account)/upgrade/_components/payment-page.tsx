"use client"

import { useRouter } from "next/navigation"
import { PropsWithChildren, useEffect } from "react"

export default function PaymentBtn({ children }: PropsWithChildren) {
  const router = useRouter()

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  const handlePayment = () => {
    const options = {
      key: "rzp_test_F05ke1JEbCqXlE", // Use your test/live key here
      currency: "INR",
      name: "Edify",
      description: "Order Payment",
      image:
        "https://media.glassdoor.com/sqll/2268419/winuall-squarelogo-1562701582366.png",
      order_id: "order_PJe7PSJOOerEo8", // Razorpay order ID from query parameter
      handler: function (response: any) {
        console.log(response) // Handle payment success response
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9090909090",
      },
      theme: {
        color: "#F37254",
      },
    }
    //@ts-ignore
    const rzp1 = new window.Razorpay(options)
    rzp1.open()
  }

  return <button onClick={handlePayment}> &nbsp; {children}</button>
}
