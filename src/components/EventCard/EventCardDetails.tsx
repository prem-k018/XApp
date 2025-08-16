import {Image, Linking, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {theme} from '@app/constants';
import {useAppContext} from '@app/store/appContext';
import {icons} from '@app/assets/icons';
import {getDateOfBirth, getTime} from '@app/utils/HelperFunction';

export type Props = {
  eventStartDateTime: string;
  eventEndDateTime: string;
  eventLink: string;
  eventLocation: string;
};
const EventCardDetails: React.FC<Props> = ({
  eventStartDateTime,
  eventEndDateTime,
  eventLink,
  eventLocation,
}) => {
  const {appConfigData} = useAppContext();

  const openLink = () => {
    Linking.openURL(eventLink);
  };

  const handleOpenMap = () => {
    // Check if the Google Maps app is installed
    Linking.canOpenURL('https://maps.google.com').then(supported => {
      if (supported) {
        // If yes, then open the Google Maps app with specified location
        Linking.openURL(`https://maps.google.com?q=${eventLocation}`);
      } else {
        // If no, then open the Google Maps with sepcified loaction in browser
        Linking.openURL(
          `https://www.google.com/maps/search/?api=1&query=${eventLocation}`,
        );
      }
    });
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 30,
      paddingHorizontal: theme.cardPadding.defaultPadding,
      gap: 14,
    },
    eventDetails: {
      fontSize: theme.fontSize.font20,
      fontFamily: theme.fonts.HCLTechRoobert.medium,
      color: appConfigData?.secondary_text_color,
    },
    eventHeader: {
      fontSize: theme.fontSize.font12,
      fontFamily: theme.fonts.Inter.regular,
      color: theme.colors.lightGray,
    },
    eventDateView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventStartDateText: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fonts.Inter.medium,
      color: theme.colors.grayScale3,
      width: 180,
      marginLeft: 10,
    },
    eventLinkText: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fonts.Inter.regular,
      color: theme.colors.blue,
      textDecorationLine: 'underline',
      marginLeft: 10,
    },
    eventLocationText: {
      fontSize: theme.fontSize.font14,
      fontFamily: theme.fonts.Inter.regular,
      color: theme.colors.blue,
      textDecorationLine: 'underline',
      marginLeft: 10,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.eventDetails}>Event Details</Text>
      {eventStartDateTime && (
        <>
          <Text style={styles.eventHeader}>Event Started at</Text>
          <View style={styles.eventDateView}>
            <Image source={icons.calenderIcon} />
            <Text style={styles.eventStartDateText}>
              {getDateOfBirth(eventStartDateTime)}
            </Text>
            <Image source={icons.calenderIcon} />
            <Text style={styles.eventStartDateText}>
              {getTime(eventStartDateTime)}
            </Text>
          </View>
        </>
      )}
      {eventEndDateTime && (
        <>
          <Text style={styles.eventHeader}>Event ended at</Text>
          <View style={styles.eventDateView}>
            <Image source={icons.calenderIcon} />
            <Text style={styles.eventStartDateText}>
              {getDateOfBirth(eventEndDateTime)}
            </Text>
            <Image source={icons.calenderIcon} />
            <Text style={styles.eventStartDateText}>
              {getTime(eventEndDateTime)}
            </Text>
          </View>
        </>
      )}
      {eventLink && (
        <>
          <Text style={styles.eventHeader}>Event Link</Text>
          <View style={styles.eventDateView}>
            <Image source={icons.linkIcon} />
            <Text style={styles.eventLinkText} onPress={openLink}>
              {eventLink}
            </Text>
          </View>
        </>
      )}
      {eventLocation && (
        <>
          <Text style={styles.eventHeader}>Event Location</Text>
          <View style={styles.eventDateView}>
            <Image source={icons.linkIcon} />
            <Text style={styles.eventLocationText} onPress={handleOpenMap}>
              {eventLocation}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

export default memo(EventCardDetails);
