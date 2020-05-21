import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors from '../constants/Colors';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {authApi} from '../api';
import {connect} from 'react-redux';
import {saveToken} from '../store/actions';
import NavigationService from '../routes/NavigationService';
import Modal from 'react-native-modal';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('email invalide').required('email Required'),
  password: Yup.string().min(2).max(60).required('le mot de passe est requis'),
});

const validationModalSchema = Yup.object().shape({
  email: Yup.string().email('email invalide').required('email Required'),
});

class SignIn extends Component {
  state = {
    modalVisible: false,
    modalMessageSent: false,
  };
  changeScreen = (screen) => {
    NavigationService.navigate(screen);
  };

  saveTokenSInStore = (tokens) => {
    this.props.saveTokens(tokens);
  };

  renderModal = () => {
    return (
      <Modal
        isVisible={this.state.modalVisible}
        hasBackdrop
        onBackButtonPress={() => {
          this.setState({modalVisible: false});
        }}
        onBackdropPress={() => {
          this.setState({modalVisible: false});
        }}>
        <View style={styles.modalWrapper}>
          {this.state.modalMessageSent ? (
            <Text style={styles.titleModal}>Confirmation</Text>
          ) : (
            <Text style={styles.titleModal}>
              Réinitialiser le mot de passe de votre compte
            </Text>
          )}

          <Formik
            initialValues={{email: ''}}
            validationSchema={validationModalSchema}
            onSubmit={(values, {setSubmitting, resetForm}) => {
              if (!this.state.modalMessageSent) {
                setSubmitting(true);
                authApi.resetPassword(values.email).then((res) => {
                  if (res) {
                    this.setState({modalMessageSent: true});
                    resetForm();
                  }
                });
                setSubmitting(false);
              } else {
                this.setState({modalVisible: false});
              }
            }}>
            {({
              values,
              handleSubmit,
              isSubmiting,
              handleErrors,
              touched,
              errors,
              handleChange,
            }) => (
              <>
                <View style={{marginBottom: 10, marginTop: 5}}>
                  {this.state.modalMessageSent ? (
                    <Text>
                      votre demande a été bien enregistré, un lien vous a été
                      envoyé pour réinitialiser votre mot de passe, penser à
                      vérifier dans vos courrier indisérables (spam)
                    </Text>
                  ) : (
                    <>
                      <FormInput
                        value={values.email}
                        name="email"
                        placeholder="testmail@gmail.com"
                        type={'emailAddress'}
                        isWrong={touched.email && errors.email}
                        errorText={errors.email}
                        onChangeText={handleChange('email')}
                      />
                      <Text>
                        si vous n'avez pas recu de mail , veuiller vérifier dans
                        votre courrier indésirable (spam)
                      </Text>
                    </>
                  )}
                </View>

                <View style={styles.buttonswrapper}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}>
                    <Text style={styles.buttonText}>
                      {this.state.modalMessageSent ? 'OK' : 'Enregistrer'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </Modal>
    );
  };

  render() {
    // if (this.props.isFocused && this.props.token !== null) {
    //   this.changeScreen('home');
    // }
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flex: 1}}>
          <ImageBackground
            source={require('../../assets/backgroundImg.png')}
            style={styles.imgBackground}
            resizeMode="stretch"
            imageStyle={styles.imgStyle}>
            <View style={styles.logoContainer}>
              <View>
                <Text style={styles.logoText}>Alia</Text>
                <Text style={styles.logoSub}>auto</Text>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <View style={styles.logoShadow} />
                </View>
              </View>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>SignIn</Text>
            </View>
            <View style={styles.globalContainer}>
              <View style={styles.avatarContaier}>
                <View style={styles.avatarBorder}>
                  <Image
                    source={require('../../assets/man.png')}
                    style={styles.avatar}
                  />
                </View>
              </View>
              <Formik
                initialValues={{email: '', password: ''}}
                validationSchema={validationSchema}
                onSubmit={(values, {setSubmitting, resetForm}) => {
                  //todo
                  /**
                  add activity indicator to button
                  change setsubmiting and resetform
                   */
                  authApi.signIn(values, this.saveTokenSInStore).then((res) => {
                    if (res) {
                      console.log(this.props);
                      //this.props.saveTokens(res);
                      this.changeScreen('home');
                    }
                  });
                  console.log('submitting');
                  console.log(values);
                }}>
                {({
                  values,
                  handleSubmit,
                  isSubmiting,
                  handleErrors,
                  touched,
                  errors,
                  handleChange,
                }) => (
                  <>
                    <View style={styles.formContainer}>
                      <FormInput
                        value={values.email}
                        name="email"
                        placeholder="testmail@gmail.com"
                        type={'emailAddress'}
                        isWrong={touched.email && errors.email}
                        errorText={errors.email}
                        onChangeText={handleChange('email')}
                      />
                      <FormInput
                        value={values.password}
                        name="mot de passe"
                        placeholder="*********"
                        type="password"
                        secureTextEntry={true}
                        onChangeText={handleChange('password')}
                        isWrong={touched.password && errors.password}
                        errorText={errors.password}
                      />
                      <View style={styles.forgetContainer}>
                        <TouchableOpacity
                          onPress={() => this.changeScreen('signUp')}>
                          <Text style={styles.creeText}>Cree un compte</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Text
                            style={styles.forgetMdp}
                            onPress={() => {
                              this.setState({
                                modalVisible: true,
                              });
                            }}>
                            mot de passe oublié ?
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{marginTop: 35}}>
                      <Button text="se connecter" onPress={handleSubmit} />
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </ImageBackground>
        </ScrollView>
        {this.renderModal()}
      </View>
    );
  }
}

const mapDispatshToProps = (dispatch) => {
  return {
    saveTokens: (tokens) => dispatch(saveToken(tokens)),
  };
};

const mapStateToProps = ({authReducer}) => {
  //console.log(authReducer);
  return {
    token: authReducer.token,
  };
};

export default connect(mapStateToProps, mapDispatshToProps)(SignIn);

const {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //height: '100%',
    backgroundColor: Colors.$bgGray,
  },
  imgBackground: {
    flex: 1,
    height: '100%',
  },
  imgStyle: {
    height: '50%',
    width,
    resizeMode: 'cover',
  },
  logoShadow: {
    marginTop: 20,
    width: 20,
    height: 5,
    backgroundColor: '#D7AB05',
    borderRadius: 100,
    transform: [{scaleX: 7}],
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
  },
  logoText: {
    fontSize: 45,
    fontWeight: 'bold',
    color: Colors.$black,
  },
  logoSub: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.$black,
    marginTop: -20,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.$black,
  },
  globalContainer: {
    marginHorizontal: 15,
    backgroundColor: Colors.$white,
    borderRadius: 36,
    height: '60%',
    shadowOpacity: 0.8,
    shadowColor: Colors.$black,
    shadowRadius: 8,
    shadowOffset: {height: 3, width: 2},
    elevation: 2,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 100,
  },
  avatarContaier: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  avatarBorder: {
    backgroundColor: Colors.$bgGray,
    width: 105,
    height: 105,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  creeText: {
    color: Colors.$baseOrange,
    fontSize: 14,
    fontWeight: 'bold',
  },
  forgetMdp: {
    color: Colors.$inputColor,
    fontSize: 14,
  },
  forgetContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  modalWrapper: {
    backgroundColor: Colors.$white,
    padding: 20,
    justifyContent: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  titleModal: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.$black,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.$baseOrange,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    width: '40%',
  },
  buttonText: {
    color: Colors.$white,
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  buttonswrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
});
