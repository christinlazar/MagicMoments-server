interface Participant {
    participantId: string;
    participantModel: 'User' | 'Vendor';
  }
  
  interface conversationInterface {
    participants: Participant[];
    messages: string[];
    lastMessage: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export default conversationInterface;
  