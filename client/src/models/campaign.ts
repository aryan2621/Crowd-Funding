export class Campaign {
    owner: string;
    title: string;
    description: string;
    target: number;
    deadline: Date;
    amountCollected: number;
    image: string;
    donators: string[];
    donations: number[];

    constructor(
        owner: string,
        title: string,
        description: string,
        target: number,
        deadline: Date,
        amountCollected: number,
        image: string,
        donators: string[],
        donations: number[],
    ) {
        this.owner = owner;
        this.title = title;
        this.description = description;
        this.target = target;
        this.deadline = deadline;
        this.amountCollected = amountCollected;
        this.image = image;
        this.donators = donators;
        this.donations = donations;
    }
}
