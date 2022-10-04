import { StyleSheet, StatusBar } from 'react-native';

const style = StyleSheet.create({
    text_white :{
        color:'white'
    },
    back_black : {
        backgroundColor:'black'
    }
    ,
    scrollView: {
        backgroundColor: 'white',
    },
    text: {
        fontSize: 22,
    },
    tagBox: {
        paddingVertical: 5,
        paddingHorizontal: 18,
        marginHorizontal: 3,
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: 'rgba(0.1, 0.1, 0.1, 0.07)',
    },
    MusicContainer: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        marginHorizontal: 3,
    },
    MusicBox: {
        justifyContent:'center',
        alignItems:'center',
        borderRadius:12,
        padding: 1,
        marginVertical: 1,
        margin: 15,
        width: 190,
        height: 245,
        flexDirection: 'row',
    },
    MusicStyle: {
        width: 170,
        height: 170,
        borderRadius:12
    },
    Logo: {
        borderRadius: 100,
        borderColor: 'rgba(0.1, 0.1, 0.1, 0.2)',
        width: 35,
        height: 35,
        borderWidth: 1,
        marginLeft: 25,
        marginRight: 12
    },
    player: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        width: 100,
        height: 100,
        borderWidth: 2,
        marginRight: 40,
        borderColor: 'white'
    },
    mypagebox1: {
        paddingLeft: 40,
        paddingTop: 20,
        marginBottom: 30,
        flex: 1
    },
    logoutbutton: {
        color: 'white',
        marginVertical: 10,
        borderColor: 'rgba(0.1, 0.1, 0.1, 0.15)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderWidth: 1,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255, 0.25)'
    },
    centeredView: {
        backgroundColor: 'white',
        justifyContent:'center',
    },
    dragContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropzone: {
        backgroundColor: 'rgba(0, 0, 256, 0.5)',
    },
    square: {
        borderRadius: 15,
        backgroundColor: 'red',
    },
    container3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    draggable: {
        width: 100,
        height: 100,
        backgroundColor: 'blue',
    },
    receiver: {
        width: 100,
        height: 100,
        backgroundColor: 'green',
    }
});


export default style;