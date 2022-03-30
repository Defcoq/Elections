pragma solidity >=0.4.22 <=0.6.0;
contract Election {

    struct Electeur {                     
        uint weight;
        bool voted;
        uint vote;
    }
    struct Candidat {                  
        uint voteCount;
    }

    address scrutateur;
    mapping(address => Electeur) Electeurs;  
    Candidat[] Candidats;

    
       //modifiers
   
    modifier onlyChair() 
     {require(msg.sender == scrutateur);
      _;
     }
     
     modifier validElecteur()
    {
        require(Electeurs[msg.sender].weight > 0, "Not a Registered Electeur");
        _;
    }

    constructor (uint numCandidats) public  {
        scrutateur = msg.sender;
        Electeurs[scrutateur].weight = 2; // weight 2 for testing purposes
        //Candidats.length = numCandidats; -- before 0.6.0
        for (uint8 prop = 0; prop < numCandidats; prop ++)
            Candidats.push(Candidat(0));
        
    }
    
     
    function register(address Electeur) public  onlyChair {
        
        Electeurs[Electeur].weight = 1;
        Electeurs[Electeur].voted = false;
    }

   
    function vote(uint toCandidat) public  validElecteur{
      
        Electeur memory sender = Electeurs[msg.sender];
        
        require (!sender.voted); 
        require (toCandidat < Candidats.length); 
        
        sender.voted = true;
        sender.vote = toCandidat;   
        Candidats[toCandidat].voteCount += sender.weight;
    }

    function reqWinner() public view returns (uint winningCandidat) {
       
        uint winningVoteCount = 0;
        for (uint prop = 0; prop < Candidats.length; prop++) 
            if (Candidats[prop].voteCount > winningVoteCount) {
                winningVoteCount = Candidats[prop].voteCount;
                winningCandidat = prop;
            }
       assert(winningVoteCount>=3);
    }
}