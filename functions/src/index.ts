import * as functions from 'firebase-functions';
import { Change, EventContext } from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/v1/firestore';
import { getExperiencesForSnapshot } from './utils';

import admin = require('firebase-admin');
admin.initializeApp();

export const ridesOnUpdate = functions.firestore
  .document('trips/{tripId}/rides/{rideId}')
  .onUpdate(
    async (change: Change<QueryDocumentSnapshot>, context: EventContext) => {
      const before = change.before.data();
      const after = change.after.data();
      const tripRef = change.after.ref.parent.parent;

      if (before.experience !== after.experience) {
        if (!tripRef) return null;
        const trip = await tripRef.get();
        if (trip.exists) {
          const ridesSnapshot = await change.after.ref.parent.get();
          const experiences = getExperiencesForSnapshot(ridesSnapshot);
          const tripData = trip.data();
          const updatedTrip = { ...tripData, rideExperiences: experiences };
          functions.logger.log(
            'Updated Experiences of trip',
            context.params.tripId,
            experiences
          );
          return tripRef.set(updatedTrip);
        }
      }
      return null;
    }
  );

exports.myFunction = functions.firestore
  .document('trips/{tripId}/rides/{rideId}')
  .onWrite(async (change, context) => {
    const tripRef = change.after.ref.parent.parent;
    if (!tripRef) return null;
    const newRideData = change.after.data();
    const tripData = await tripRef.get();
    if (tripData.exists && newRideData?.experience) {
      const ridesSnapshot = await change.after.ref.parent.get();
      const experiences = getExperiencesForSnapshot(ridesSnapshot);
      const updatedTrip = {
        ...tripData.data(),
        rideExperiences: experiences,
      };
      functions.logger.log(
        'Updated Experiences of trip',
        context.params.tripId,
        experiences
      );
      return tripRef.set(updatedTrip);
    }

    return null;
  });
