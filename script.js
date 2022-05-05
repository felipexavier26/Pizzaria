let cart = [];
let modalQT = 1;
let modalKey = 0;

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    /*selecionar a pizza*/
    pizzaItem.setAttribute('data-key', index);

    /*Seleciona a imagem para mostra na tela*/
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    /*Seleciona o valor em R$*/
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$  ${item.price.toFixed(2)}`;

    /* selecionar o nome do produto*/
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;

    /*Seleciona a descrição do produto*/ 
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    /*Evento  de click pra abrir o modal*/
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQT = 1;
        modalKey =key;

        /*Adicionando as informação no model*/

        /*Adicionando a imagems da pizza*/
        c('.pizzaBig img').src = pizzaJson [key].img;

        /*Adicionado o nome da pizza*/
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;

        /*Adicionando a descrição da pizza*/
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key]. description;

        /*Adicionando o valor da pizza*/
        c('.pizzaInfo--actualPrice').innerHTML = `R$  ${item.price.toFixed(2)}`;

        /* para não ser seleciona nenhuma opção*/
        c('.pizzaInfo--size.selected').classList.remove('selected');

       /*Adicionado o tamanha da pizza*/
       cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{

           /*Adicionando onde sera selecionado*/
           if (sizeIndex == 2){
               size.classList.add('selected');
           }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

       });
       /*Selecionando a quantidade*/
       c('.pizzaInfo--qt').innerHTML = modalQT;
       
        /* aparecer  o models que sera na tela */ 
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity =1;
        }, 200);
    });

     c('.pizza-area').append(pizzaItem);
});

// evento do modal//
 
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

//Botão de cancelar o modal//
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click',closeModal);
});

/*Adicionando a quantidade 'menos'*/
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if (modalQT >1){
    modalQT --;
    c('.pizzaInfo--qt').innerHTML = modalQT;
    }   
});

/*Adicionando a quantidade "mais'*/
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQT ++;
    c('.pizzaInfo--qt').innerHTML = modalQT;
});

/*Adicionando o tamanho de escolha*/
cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
    size.addEventListener( 'click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
/*Adiocando o botão de adicionar no carrinho*/
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    // qual a pizza?
    console.log("pizza", modalKey);
    // qual o tamanho?
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    console.log("tamanho:" + size);
    // qual a quantidade?
    console.log("Quantidade:" + modalQT);

    /*Identificador de quantidades*/

    let identifier =  pizzaJson[modalKey].id +'@'+size;
    
    let key = cart.findIndex((item)=>{return item.identifier == identifier
    });
    if(key > -1){
        cart[key].qt += modalQT;
    }else{
    cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQT
    });
}
    updateCart();
    closeModal();
});
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener( 'click',()=>{
    c('aside').style.left = '100vw';
});
    /* Aparecendo a tela de add no carrinho*/   
    function updateCart() {
        c('.menu-openner span').innerHTML = cart.length;
        if (cart.length >0){
            c('aside').classList.add('show');
            c('.cart').innerHTML = '';

            /*Criando variavel para ver o valor*/
            let subtotal = 0;
            let desconto = 0;
            let total  = 0;
            /* Adicionando as informação no carinho*/
            for (let i in cart){
                let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
                subtotal += pizzaItem.price * cart[i].qt;

                let cartItem = c('.models .cart--item').cloneNode(true);
                let pizzaSizeName;
                switch(cart[i].size) {
                    case 0:
                        pizzaSizeName = 'p';
                        break;
                     case 1:
                         pizzaSizeName ='M';   
                         break;
                     case 2:
                         pizzaSizeName = 'G';
                         break;              

                }
                                
                let pizzaName =`${pizzaItem.name} (${pizzaSizeName})`;

                cartItem.querySelector('img').src = pizzaItem.img;
                cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
                cartItem.querySelector('.cart--item--qt').innerHTML = cart [i].qt;

                cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                    if(cart[i].qt > 1){
                        cart[i].qt--;
                    } else {
                        cart.splice(i, 1);
                    }
                    updateCart();

                });
                cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                    cart[i].qt++;
                    updateCart();

                });
                c('.cart').append(cartItem);
              }
              /* aplicando o valor*/
              desconto = subtotal * 0.1;
              total = subtotal - desconto;

              c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
              c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
              c('.total span:last-child').innerHTML =  `R$ ${total.toFixed(2)}`;
              

             
              

        } else {
            c('aside').classList.remove('show');
            c('aside').style.left = '100vw';
        }
        
    }

