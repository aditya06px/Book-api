let books = [
    {
    ISBN: '12345ONE',
    title: 'naruto shippuden',
    authors: [1,2],
    language: 'english',
    pubDate: '13/10/2022',
    numOfPage: 200,
    category: ['fiction','drama','action','slice of life'],
    publication: 1,
    },
   {
    ISBN: '12345TWO',
    title: 'you dont know js',
    authors: [1,2,3],
    language: 'english',
    pubDate: '06/11/2022',
    numOfPage: 300,
    category: ['programming','tech','web dev','fiction'],
    publication: 3,
    },
];

let authors = [
    {
        id: 1,
        name: 'masashi kishimoto',
        books: ['12345ONE','12345TWO'],
    },
    {
        id: 2,
        name: 'kakashi hatake',
        books: ['12345ONE','12345TWO'],
    },
    {
        id: 3,
        name: 'sasuke uchiha',
        books: ['12345ONE','12345TWO'],
    }
];

let publications = [
    {
        id:1,
        name: 'Chakra',
        books:['12345ONE']
    },
    {
        id:2,
        name: 'Penguine',
        books:['12345TWO']
    },
    {
        id:3,
        name: 'Mane publication',
        books:[]
    }
];

module.exports =  { books , authors , publications};