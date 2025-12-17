export default class Points{
    x;
    y;
    points = [];

    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    validBounds(x,y){
        if((x >= 0 && x < 8) && (y >= 0 && y < 8)){
            return true;
        }
        return false;
    }

    knightMoves(x,y){

        let new_x = x+1;
        let new_y = y+2;

        if (this.validBounds(new_x,new_y)){
            this.points.push([new_x,new_y]);
        }

        new_x = x+1;
        new_y = y-2;

        if (this.validBounds(new_x,new_y)){
            this.points.push([new_x,new_y]);
        }

        new_x = x-1;
        new_y = y+2;

        if (this.validBounds(new_x,new_y)){
            this.points.push([new_x,new_y]);
        }

        new_x = x-1;
        new_y = y-2;

        if (this.validBounds(new_x,new_y)){
            this.points.push([new_x,new_y]);
        }

        new_x = x+2;
        new_y = y+1;

        if (this.validBounds(new_x,new_y)){
            this.points.push([new_x,new_y]);
        }


        new_x = x+2;
        new_y = y-1;

        if (this.validBounds(new_x,new_y)){
            this.points.push([new_x,new_y]);
        }

        new_x = x-2;
        new_y = y+1;

        if (this.validBounds(new_x,new_y)){
            this.points.push([new_x,new_y]);
        }

        new_x = x-2;
        new_y = y-1;

        if (this.validBounds(new_x,new_y)){
            this.points.push([new_x,new_y]);
        }
    }

    rookMoves(x,y){

        for(let row = 0; row < 8 ; row++){
            if(this.validBounds(x,row) )  this.points.push([x,row]);
            if(this.validBounds(row,y))  this.points.push([row,y]);
        }
    }

    bishopMoves(x,y){

        for(let diagonal = 0; diagonal <8; diagonal++){
            const distance = Math.abs(x-diagonal);

            let newX = x + distance;
            let newY = y +  distance;

            if(this.validBounds(newX,newY)) this.points.push([newX,newY]);
            
            newX = x - distance;
            if(this.validBounds(newX,newY)) this.points.push([newX,newY]);
            
            newY = y - distance;
            if(this.validBounds(newX,newY)) this.points.push([newX,newY]);
            
            newX = x + distance;
            if(this.validBounds(newX,newY)) this.points.push([newX,newY]);
        }
    }

    kingMoves(x,y){

        let newX = x + 1;
        if(this.validBounds(newX,y)) this.points.push([newX,y]);

        let newY = y-1;
        if(this.validBounds(newX,newY)) this.points.push([newX,newY]);

        if(this.validBounds(x,newY)) this.points.push([x,newY]);
        
        newY = y+1;
        if(this.validBounds(newX,newY)) this.points.push([newX,newY]);

        if(this.validBounds(x,newY)) this.points.push([x,newY]);

        newX = x-1;
        if(this.validBounds(newX,y)) this.points.push([newX,y]);

        if(this.validBounds(newX,newY)) this.points.push([newX,newY]);

        newY = y-1;
        if(this.validBounds(newX,newY)) this.points.push([newX,newY]);
    }

    queenMoves(x,y){

        this.rookMoves(x,y);
        this.bishopMoves(x,y);
        this.kingMoves(x,y);
    }

    pawnMoves(x,y, pieceColor){
        if(x == 1 && pieceColor === "w") {
            let newX = x + 1;
            if(this.validBounds(newX,y)) this.points.push([newX,y]);

            newX = x + 2;
            if(this.validBounds(newX,y)) this.points.push([newX,y]);
        }
        else if((x > 1 && x <= 6 ) && pieceColor === "w"){
            let newX = x + 1;
            if(this.validBounds(newX,y)) this.points.push([newX,y]);
        }
        else if(x == 6 && pieceColor === "b"){
            let newX = x - 1;
            if(this.validBounds(newX,y)) this.points.push([newX,y]);

            newX = x - 2;
            if(this.validBounds(newX,y)) this.points.push([newX,y]);
        }
        else if((x < 6 && x >= 1 ) && pieceColor === "b"){
            let newX = x - 1;
            if(this.validBounds(newX,y)) this.points.push([newX,y]);
        }
    }

    availableMoves(x,y,piece,pieceColor){

        if(piece === "r"){
            this.rookMoves(x,y);
        }else if(piece === "n"){
            this.knightMoves(x,y);
        }else if(piece === "b"){
            this.bishopMoves(x,y);
        }else if(piece === "q"){
            this.queenMoves(x,y);
        }else if(piece === "k"){
            this.kingMoves(x,y);
        }else if(piece === "p"){
            this.pawnMoves(x,y,pieceColor);
        }
        return this.points
    }

    Print(){
        console.log("points : " + this.points);
    }
}

// let moves = new Points;
// moves.availableMoves(0,1,"b");
// moves.Print()