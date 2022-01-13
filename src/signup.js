import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import PhoneOutlined from '@mui/icons-material/PhoneOutlined';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormHelperText from '@mui/material/FormHelperText'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment'
import axios from 'axios'
const MicRecorder = require('mic-recorder-to-mp3');

const recorder = new MicRecorder({
  bitRate: 128
})

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      repassword: '',
      userAudio: '',
      acceptedTnC: false,
      error: false,
      submitted: false,
      blobURL: '',
      isRecording: '',
      time: 0,
      saving: false
    }

  }
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.validate()) {
      this.setState({ saving: true })
      let data = {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        audio: this.state.userAudio,
        acceptedTnC: this.state.acceptedTnC,
        phoneNumber: this.state.phoneNumber
      }
      axios.post('http://localhost:3001/users', data).then(result => {
        this.props.userName(this.state.name)
        this.props.logged(true)
      }).catch(e => {
        console.log(e);
      })
    }
    else {
      this.setState({ error: true })
    }
  };
  handleTime = () => {
    if (this.state.isRecording) {
      this.setState({ blobURL: '' });
      this.interval = setInterval(() => {
        this.setState({ time: this.state.time + 1 })

      }, 1000);
    }
    else {
      clearInterval(this.interval);
      this.setState({ time: 0 })
    }
  }
  startRecord = () => {
    recorder.start().then(() => {
      this.setState({ isRecording: !this.state.isRecording }, this.handleTime)
    }).catch(e => {
      console.log(e);
    })
  }
  stopRecord = () => {
    recorder.stop().getMp3().then(async ([buffer, blob]) => {
      const bufferData = await blob.arrayBuffer();
      const view = new Int8Array(bufferData);
      let binary = view.reduce((str, byte) => str + (byte >>> 0).toString(2), '');
      const blobUrl = URL.createObjectURL(blob);
      this.setState({ blobURL: blobUrl, isRecording: false, userAudio: binary }, this.handleTime)
    }).catch(e => {
      alert('something went wrong while recording voice.')
      console.log(e);
    })

  }
  validate() {
    if (this.state.repassword != this.state.password) {
      return false;
    }
    if (this.state.phoneNumber.length != 10) {
      return false;
    }
    if (this.state.userAudio.length == 0) {
      return false;
    }
    return true;
  }
  handleFormChange = (event) => {
    const value = event.target.value;
    const field = event.target.name;
    if (field == 'acceptedTnC') {
      this.setState({ [field]: !this.state.acceptedTnC })
    }
    else if (field == 'phoneNumber') {
      if (value.length < 11 && !value.includes('-')) {
        this.setState({ [field]: value })
      }
    }
    else {
      this.setState({ [field]: value })

    }
  }
  passwordValidation = () => {
    let value = this.state.password;
    const isWhitespace = /^(?=.*\s)/;
    if (isWhitespace.test(value)) {
      return "Password must not contain Whitespaces.";
    }


    const isContainsUppercase = /^(?=.*[A-Z])/;
    if (!isContainsUppercase.test(value)) {
      return "Password must have at least one Uppercase Character.";
    }


    const isContainsLowercase = /^(?=.*[a-z])/;
    if (!isContainsLowercase.test(value)) {
      return "Password must have at least one Lowercase Character.";
    }


    const isContainsNumber = /^(?=.*[0-9])/;
    if (!isContainsNumber.test(value)) {
      return "Password must contain at least one Digit.";
    }


    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
    if (!isContainsSymbol.test(value)) {
      return "Password must contain at least one Special Symbol.";
    }


    const isValidLength = /^.{8,}$/;
    if (!isValidLength.test(value)) {
      return "Password length should be greater than or equal to 8";
    }
    return null;
  }



  render() {
    return (

      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" onSubmit={this.handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    helperText={this.state.error ? 'Name is mandatory' : ''}
                    error={this.state.error && !this.state.name}
                    onChange={this.handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    type='email'
                    autoComplete="email"
                    helperText={this.state.error ? 'Email is mandatory' : ''}
                    error={this.state.error && !this.state.email}
                    onChange={this.handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    inputProps={{ minLength: 8 }}
                    autoComplete="new-password"
                    helperText={this.state.password != '' ? this.passwordValidation() : ''}
                    error={this.state.password != '' && this.passwordValidation()}
                    onChange={this.handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined />
                        </InputAdornment>
                      ),
                    }}

                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="repassword"
                    label="Reenter Password"
                    type="password"
                    id="repassword"
                    helperText={this.state.error && this.state.password != this.state.repassword ? 'Password does not match' : ''}
                    error={this.state.error && this.state.password != this.state.repassword}
                    onChange={this.handleFormChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined />
                        </InputAdornment>
                      ),
                    }}

                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="phoneNumber"
                    label="Enter phone number"
                    id="phoneNumber"
                    helperText={this.state.error && this.state.phoneNumber.length != 10 ?
                      'Please enter 10 digit valid phone number' : ''}
                    error={this.state.error && this.state.phoneNumber.length != 10}
                    onChange={this.handleFormChange}
                    type='number'
                    value={this.state.phoneNumber}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneOutlined />
                        </InputAdornment>
                      ),

                    }}

                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox required checked={this.state.acceptedTnC} name='acceptedTnC' color="primary" onChange={this.handleFormChange} />}
                    label="Accept Terms and Conditions"
                  />
                  <FormHelperText error>
                    {this.state.error && !this.state.acceptedTnC ? "you should accept terms and conditions to signup" : ''}

                  </FormHelperText>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div>tell us yourself in some words</div>
                  <FormHelperText error>
                    {this.state.error && this.state.userAudio.length == 0 ? "voice introduction is mandatory" : ''}

                  </FormHelperText>

                </Grid>
                <Grid item xs={12} sm={8}>
                  <audio style={{ width: '100%' }} src={this.state.blobURL} controls="controls" />

                </Grid>
                <Grid item xs={12} sm={4}>
                  {this.state.isRecording ?
                    <Button style={{ borderRadius: '20px', marginTop: '7px' }} variant='contained' onClick={this.stopRecord} startIcon={<StopIcon />}>
                      <span>{Math.floor(this.state.time / 60) < 10 ? 0 : ''}{Math.floor(this.state.time / 60)}</span>
                      <span>{Math.floor(this.state.time % 60) < 10 ? 0 : ''}{Math.floor(this.state.time % 60)}</span>
                    </Button> :
                    <Button style={{ borderRadius: '20px', marginTop: '7px' }} variant='contained' onClick={this.startRecord} startIcon={<MicIcon />}>
                      Record
                    </Button>
                  }

                </Grid>

              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={this.state.saving}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Container>
      </ThemeProvider>
    );
  }
}