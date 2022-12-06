import {
	Publisher,
	Subjects,
	ExpirationCompleteEvent,
} from '@vvtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
