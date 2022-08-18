import * as functions from 'firebase-functions';
import { Change, EventContext } from 'firebase-functions';
import { QueryDocumentSnapshot } from 'firebase-functions/v1/firestore';
import { getExperiencesForSnapshot, hasStoryForRidesSnapshot } from './utils';

import admin = require('firebase-admin');

admin.initializeApp();

export const ridesOnCreate = functions.firestore
  .document('/trips/{tripId}/rides/{rideId}')
  .onWrite(
    async (
      change: Change<functions.firestore.DocumentSnapshot>,
      context: EventContext
    ) => {
      const tripRef = change.after.ref.parent.parent;
      if (!tripRef) return null;
      const ridesSnapshot = await change.after.ref.parent.get();
      const experiences = getExperiencesForSnapshot(ridesSnapshot);
      const hasStory = hasStoryForRidesSnapshot(ridesSnapshot);
      return tripRef.update({
        hasStory,
        experiences,
      });
    }
  );

export const ridesOnUpdate = functions.firestore
  .document('trips/{tripId}/rides/{rideId}')
  .onUpdate(
    async (change: Change<QueryDocumentSnapshot>, context: EventContext) => {
      const before = change.before.data();
      const after = change.after.data();
      const tripRef = change.after.ref.parent.parent;

      if (!tripRef) return null;

      const trip = await tripRef.get();
      if (before.story !== after.story) {
        if (trip.exists) {
          const ridesSnapshot = await change.after.ref.parent.get();
          const hasStory = hasStoryForRidesSnapshot(ridesSnapshot);
          const tripData = trip.data();
          const updatedTrip = { ...tripData, hasStory };
          functions.logger.log('has story', context.params.tripId, hasStory);
          return tripRef.set(updatedTrip);
        }
      }
      if (before.experience !== after.experience) {
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
