import { createRequire } from "module";
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");


const REMINDES = [7, 5, 2];

export const sendReminder = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status != 'active') return;


    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal Date has been passed for subscription ${subscription.name} . Stopping Workflow  `);
        return;
    }

    for (const daysBefore of REMINDES) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        // ex  : renewal date is 22 feb , reminder date is 15 feb

        if (reminderDate.isAfter(dayjs())) {
            // put in sleep 
            await sleepUntileReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        await triggreReminder(context, `Reminder ${daysBefore} days before` );
    }




});



const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        // the Subscription , with user info , especially name and email 
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}


const sleepUntileReminder = async (context, label, date) => {
    console.log(`Sleep Untile ${label} reminder at ${date}`);
    await context.SleepUntil(label, date.toDate());
}


const triggreReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`tiggring ${label} reminder`);
        // Here you can : send email , SMS , notifications ..etc.

    });
};