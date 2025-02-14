import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItem, Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper, Snackbar } from '@mui/material';
import { Field, Form, Formik, FormikConfig, FormikValues, ErrorMessage } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import * as Yup from 'yup';

interface MyFormValues {
  fullName: string;
  PhoneNumber: string;
  Email: string;
  agree: boolean;
  yearSem: string;
  amount: number;
  branch: string;
  description: string;
  Roll: string;
  DOB: string;
  Section: string;
  feeType: string;
  yearSemFee: string;
}

const sleep = (time: number) => new Promise((acc) => setTimeout(acc, time));

const validationSchema = Yup.object({
  fullName: Yup.string().required('Full Name is required'),
  PhoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Phone number is not valid').required('Phone Number is required'),
  Email: Yup.string().email('Invalid email address').required('Email is required'),
  agree: Yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
  yearSem: Yup.string().required('Year-Semester is required'),
  branch: Yup.string().required('Branch is required'),
  description: Yup.string(),
});

interface FormikStepProps {
  children: React.ReactNode;
  label: string;
  validationSchema?: Yup.ObjectSchema<any>;
}

export default function Formfill() {
  const [initialValues, setInitialValues] = useState<MyFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFeeType, setSelectedFeeType] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/'); // Redirect to home if no token found
        return;
      }

      try {
        const response = await fetch('/v1/api/fee/verify', {
          method: 'POST',
          headers: { authorization: `${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const feeType = data.feeType || '';
          const yearSemFee = feeType === 'CollegeFee' || feeType === 'TransportFee'
            ? `${data.feeYear}`
            : `${data.feeYear}-${data.feeSem}`;

          setInitialValues({
            fullName: data.Name || '',
            PhoneNumber: data.StudentMobileNo || '',
            Email: data.studentMailId || '',
            agree: false,
            yearSem: `${data.CurrentYear}-${data.CurrentSem}`,
            amount: data.fee || 0,
            branch: data.Branch || '',
            description: '',
            Roll: data.Roll || '',
            DOB: data.DOB || '',
            Section: data.Section || '',
            feeType,
            yearSemFee,
          });

          setSelectedFeeType(feeType);
          setLoading(false);
        } else {
          localStorage.removeItem('token');
          navigate('/');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        navigate('/');
      }
    };

    verifyToken();
  }, [navigate]);

const handleUpdate = async (values) => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/');
    return;
  }

  try {
    // Step 1: Update fee details
    const updateResponse = await fetch('/v1/api/fee/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${token}`,
      },
      body: JSON.stringify({
        PhoneNumber: values.PhoneNumber,
        Email: values.Email,
        description: values.description,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to update fee details: ${await updateResponse.text()}`);
    }

    // Step 2: Get Razorpay key
    const keyResponse = await fetch('/v1/api/razor/getkey', {
      method: 'POST',
      headers: {
        authorization: `${token}`,
      },
    });

    if (!keyResponse.ok) {
      throw new Error(`Failed to fetch Razorpay key: ${await keyResponse.text()}`);
    }

    const { key } = await keyResponse.json();

    // Step 3: Create Razorpay order
    const orderResponse = await fetch('/v1/api/razor/payment/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `${token}`,
      },
      body: JSON.stringify({ amount: values.amount }),
    });

    if (!orderResponse.ok) {
      throw new Error(`Order creation failed: ${await orderResponse.text()}`);
    }

    const { order } = await orderResponse.json();

    // Step 4: Configure and open Razorpay payment modal
    // Step 4: Configure and open Razorpay payment modal
    const options = {
      key,
      amount: order.amount,
      currency: 'INR',
      name: 'CVR College Of engineering',
      description: 'Fee Payments',
      image: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Cvrh.ibp.jpg',
      order_id: order.id,
      callback_url: `/v1/api/razor/payment/paymentverification`,
      prefill: {
        name: values.fullName,
        email: values.Email,
        contact: values.PhoneNumber,
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#121212',
      },

    // Add handler function to verify payment after success
    handler: async function (response) {
      try {
        const verificationResponse = await fetch(`/v1/api/razor/payment/paymentverification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `${token}`,
          },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        if (!verificationResponse.ok) {
          throw new Error(`Payment verification failed: ${await verificationResponse.text()}`);
        }
  
        const result = await verificationResponse.json();
        console.log('Payment verification successful:', result);
  
        // Redirect on successful verification
        const {
          transactionId,
          razorpayOrderId,
          feeType,
          feeYear,
          feeSem,
          roll,
          name,
          phone,
          amount,
          date,
          time
        } = result;
  
        // Construct redirect URL with transaction data as query parameters
        //const redirectUrl = `/success?transactionId=${transactionId}s&razorpayOrderId=${razorpayOrderId}&feeType=${feeType}&feeYear=${feeYear}&feeSem=${feeSem}&roll=${roll}&name=${encodeURIComponent(name)}&phone=${phone}&amount=${amount}&date=${date}&time=${time}`;
        localStorage.removeItem('token')
        navigate(`/success?transactionId=${transactionId}&razorpayOrderId=${razorpayOrderId}&feeType=${feeType}&feeYear=${feeYear}&feeSem=${feeSem}&roll=${roll}&name=${encodeURIComponent(name)}&phone=${phone}&amount=${amount}&date=${date}&time=${time}`);
      } catch (verificationError) {
        console.error('Error during payment verification:', verificationError);
        // Handle verification error (e.g., show error message)
      }
    },
  };

  const razor = new window.Razorpay(options);
  razor.open();
}catch (error) {
    console.error('Error updating data:', error);
  }
};

  const handleSuccessClose = () => {
    setSuccess(false);
  };


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardContent>
        <FormikStepper
          initialValues={initialValues || {
            fullName: '',
            PhoneNumber: '',
            Email: '',
            agree: false,
            yearSem: '',
            amount: 0,
            branch: '',
            description: '',
            Roll: '',
            DOB: '',
            Section: '',
            feeType: '',
            yearSemFee: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await sleep(3000);
            await handleUpdate(values);
            setSuccess(true);
          }}
        >
          <FormikStep label="Personal Data" validationSchema={validationSchema}>
            <Box paddingBottom={2}>
              <Field fullWidth name="fullName" component={TextField} label="Full Name" InputProps={{ readOnly: true }} />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="PhoneNumber" component={TextField} label="Phone Number" type="tel" InputProps={{ readOnly: true }} />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="Email" component={TextField} label="Email" type="email" required />
            </Box>
            <Box paddingBottom={2}>
              <Field
                name="yearSem"
                component={TextField}
                label="Current Year-Semester"
                select
                fullWidth
                InputProps={{ readOnly: true }}
              >
                <MenuItem value="I-I">I-I</MenuItem>
                <MenuItem value="I-II">I-II</MenuItem>
                <MenuItem value="II-I">II-I</MenuItem>
                <MenuItem value="II-II">II-II</MenuItem>
                <MenuItem value="III-I">III-I</MenuItem>
                <MenuItem value="III-II">III-II</MenuItem>
                <MenuItem value="IV-I">IV-I</MenuItem>
                <MenuItem value="IV-II">IV-II</MenuItem>
              </Field>
            </Box>
            <Box paddingBottom={2}>
              <Field
                name="branch"
                component={TextField}
                label="Branch"
                select
                fullWidth
                InputProps={{ readOnly: true }}
              >
                <MenuItem value="CSE">CSE</MenuItem>
                <MenuItem value="ET">ET</MenuItem>
                <MenuItem value="EEE">EEE</MenuItem>
                <MenuItem value="ECE">ECE</MenuItem>
                <MenuItem value="MECH">MECH</MenuItem>
                <MenuItem value="CIVIL">CIVIL</MenuItem>
                <MenuItem value="EIE">EIE</MenuItem>
              </Field>
            </Box>
            <Box paddingBottom={2}>
              <Field
                name="agree"
                type="checkbox"
                component={CheckboxWithLabel}
                Label={{ label: 'I confirm that above details are true' }}
              />
              <div style={{ color: 'red' }}>
                <ErrorMessage name="agree" />
              </div>
            </Box>
          </FormikStep>
          <FormikStep label="Fee Details">
            <Box paddingBottom={2}>
              <Field fullWidth name="Roll" component={TextField} label="Roll Number" InputProps={{ readOnly: true }} />
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="amount" component={TextField} label="Amount to be Paid" InputProps={{ readOnly: true }} />
            </Box>
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="feeType"
                component={TextField}
                label="Fee Category"
                InputProps={{ readOnly: true }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedFeeType(e.target.value)}
              />
            </Box>
            <Box paddingBottom={2}>
              {selectedFeeType && (selectedFeeType === 'CollegeFee' || selectedFeeType === 'TransportFee') ? (
                <Field
                  name="yearSemFee"
                  component={TextField}
                  label="Fee Paying for Year"
                  select
                  fullWidth
                  InputProps={{ readOnly: true }}
                >
                  <MenuItem value="I">I</MenuItem>
                  <MenuItem value="II">II</MenuItem>
                  <MenuItem value="III">III</MenuItem>
                  <MenuItem value="IV">IV</MenuItem>
                </Field>
              ) : (
                <Field
                  name="yearSemFee"
                  component={TextField}
                  label="Fee Paying for Year-Semester"
                  select
                  fullWidth
                  InputProps={{ readOnly: true }}
                >
                  <MenuItem value="I-I">I-I</MenuItem>
                  <MenuItem value="I-II">I-II</MenuItem>
                  <MenuItem value="II-I">II-I</MenuItem>
                  <MenuItem value="II-II">II-II</MenuItem>
                  <MenuItem value="III-I">III-I</MenuItem>
                  <MenuItem value="III-II">III-II</MenuItem>
                  <MenuItem value="IV-I">IV-I</MenuItem>
                  <MenuItem value="IV-II">IV-II</MenuItem>
                </Field>
              )}
            </Box>
            <Box paddingBottom={2}>
              <Field fullWidth name="description" component={TextField} label="Description" multiline rows={4} />
            </Box>
          </FormikStep>
        </FormikStepper>
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleSuccessClose}
          message="Form submitted successfully!"
        />
      </CardContent>
    </Card>
  );
}

function FormikStep({ children, validationSchema }: FormikStepProps) {
  return <>{children}</>;
}

function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step] as React.ReactElement<FormikStepProps>;
  const [completed, setCompleted] = useState(false);

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
        } else {
          setStep((s) => s + 1);
          helpers.setTouched({});
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step key={child.props.label} completed={step > index || completed}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentChild}

          <Grid container spacing={2}>
            {step > 0 ? (
              <Grid item>
                <Button
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
              </Grid>
            ) : null}
            <Grid item>
              <Button
                startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? 'Submitting' : isLastStep() ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
