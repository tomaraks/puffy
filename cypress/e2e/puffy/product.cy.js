describe('Product Page Testing', () => {

    beforeEach(() => {
        cy.visit('https://puffy.com/products/puffy-lux-mattress?view=new');
    })

    it('Page Navigation Verification', () => {
        cy.get('.breadcrumbs__list > .breadcrumbs__item').eq(0).should('have.text', 'Home');
        cy.get('.breadcrumbs__list > .breadcrumbs__item').eq(1).should('have.text', 'Mattresses');
        cy.get('.breadcrumbs__list > .breadcrumbs__item').eq(2).contains('Puffy Cloud Lux');
    })

    it('Product Verification', () => {
        cy.get('h1.product-head__title').contains('Puffy Cloud Lux');
        cy.get('.product-head-description--desktop').should('have.text', ' Our best seller. Recommended by Consumer Reports, the Puffy Cloud Lux Hybrid offers all the cooling comfort and support of the Puffy Cloud Mattress, with an added layer of pocketed coils and contouring foam. With high-density foam specially designed to support the spine and reduce back pain, you can enjoy luxurious cloudlike comfort and total pressure relief all in one.');
        cy.get('.product-images__main picture').should(($p) => {
            expect($p).to.have.length(7);
        })
        let listOfSizes = ['Twin', 'Twin XL', 'Full', 'Queen', 'King', 'Cal King', 'Split King'];
        cy.get('.pd-variants--size .pd-buttons__item label').should(($p) => {
            expect($p).to.have.length(7);
            expect($p).to.have.text(listOfSizes.toString().replace(/,/g, ''));
        });
    })

    it('Rate, Size & Free Items Changes Verification', () => {
        let listOfSizes = ['Twin', 'Twin XL', 'Full', 'Queen', 'King', 'Cal King', 'Split King'];
        let listOfPricesOld = ['$1,749', '$1,799', '$2,049', '$2,249', '$2,449', '$2,449', '$3,598'];
        let listOfPricesNew = [' $999', ' $1,049', ' $1,299', ' $1,499', ' $1,699', ' $1,699', ' $2,098'];
        let listOfMeasures = ['38"W x 75"L x 12"H', '38"W x 80"L x 12"H', '54"W x 75"L x 12"H', '60"W x 80"L x 12"H', '76"W x 80"L x 12"H', '72"W x 84"L x 12"H', '2 -   38"W x 80"L x 12"H'];
        let arrayOfFreeItems = [["1", "1", "1"], ["1", "1", "1"], ["2", "1", "1"], ["2", "1", "1"], ["2", "1", "1"], ["2", "1", "1"], ["2", "2", "2"]];
        for (let i = 0; i < listOfSizes.length; i++) {
            cy.get(".popup--subscribe .popup__box", { timeout: 50000 }).then($button => {
                if ($button.is(':visible')) {
                    cy.get('#subscribe-popup .popup__box .popup__close > svg > use').click();
                }
            })
            cy.get('.pd-variants--size .pd-buttons__item').contains(listOfSizes[i]).click({ force: true });
            cy.get('.pd-variants__old-price span').eq(0).should('have.text', listOfPricesOld[i]);
            cy.get('#dynamic-price').should('have.text', listOfPricesNew[i]);
            cy.get('.pd-variants__size').should('contain', listOfMeasures[i]);
            cy.get('.subscribe-popup-block-steps__step.is--first  .free-acc-box__title').eq(0).invoke('attr', 'data-pillow-qty').then((number) => {
                expect(number).to.equal(arrayOfFreeItems[i][0]);
            });
            cy.get('.subscribe-popup-block-steps__step.is--first  .free-acc-box__title').eq(1).invoke('attr', 'data-combo-qty').then((number) => {
                expect(number).to.equal(arrayOfFreeItems[i][1]);
            });
            cy.get('.subscribe-popup-block-steps__step.is--first  .free-acc-box__title').eq(2).invoke('attr', 'data-combo-qty').then((number) => {
                expect(number).to.equal(arrayOfFreeItems[i][2]);
            });
        };
    })

    it('Review and FAQ are available', () => {
        cy.get('.product-head__reviews').contains('Reviews').click();
        cy.get('.jdgm-subtab .jdgm--active').should('contain', 'Reviews');
        cy.scrollTo('top');
        cy.get('.product-head__faq__text').contains('FAQs').click({ force: true });
        cy.get('.compare-section-title').should('contain', 'Questions');
    })

    it('Add to Cart works fine', () => {
        let listOfSizes = ['Twin', 'Twin XL', 'Full', 'Queen', 'King', 'Cal King', 'Split King'];
        let listOfPricesOld = ['$1,749', '$1,799', '$2,049', '$2,249', '$2,449', '$2,449', '$3,598'];
        let arrayOfFreeItems = [["1", "1", "1"], ["1", "1", "1"], ["2", "1", "1"], ["2", "1", "1"], ["2", "1", "1"], ["2", "1", "1"], ["2", "2", "2"]];
        for (let i = 0; i < listOfSizes.length; i++) {
            cy.get('.pd-variants--size .pd-buttons__item').contains(listOfSizes[i]).click({ force: true });
            cy.get('#cta').contains('Add to Cart').click({ force: true });
            if (i == 0) {
                cy.get(".popup--subscribe.is--open .popup__box", { timeout: 100000 }).then($button => {
                    if ($button.is(':visible')) {
                        cy.get('#subscribe-popup .popup__box .popup__close > svg > use').click();
                        cy.get('a.icon-cart').click();
                    }
                })
            }
            cy.get('#cart .cart-headline__value').eq(1).should('have.text', listOfSizes[i]);
            cy.get('.cart-totals--final .cart-totals__number').should('have.text', listOfPricesOld[i]);
            cy.get('#cart .qty-box').eq(0).invoke('attr', 'data-fake-qty').then((number) => {
                expect(number).to.equal('1');
            });
            cy.get('.cart-item__qty-badge').eq(0).should('have.text', arrayOfFreeItems[i][0]);
            cy.get('.cart-item__qty-badge').eq(1).should('have.text', arrayOfFreeItems[i][1]);
            cy.get('.cart-item__qty-badge').eq(2).should('have.text', arrayOfFreeItems[i][1]);

            cy.visit('https://puffy.com/products/puffy-lux-mattress?view=new');

        };

    })

    it('Cart funtions works fine', () => {
        cy.get('.pd-variants--size .pd-buttons__item').contains('Twin').click({ force: true });
        cy.get('#cta').contains('Add to Cart').click();
        cy.get('#cart .cart-headline__value').eq(1).should('have.text', 'Twin');
        cy.get('.cart-totals--final .cart-totals__number').should('have.text', '$1,749');
        cy.get('#cart .qty-box').eq(0).invoke('attr', 'data-fake-qty').then((number) => {
            expect(number).to.equal('1');
        });
        cy.get('.cart-item__qty-badge').eq(0).should('have.text', '1');
        cy.get('.cart-item__qty-badge').eq(1).should('have.text', '1');
        cy.get('.cart-item__qty-badge').eq(2).should('have.text', '1');

        cy.wait(7000);
        cy.get(".popup--subscribe .popup__box", { timeout: 100000 }).then($button => {
            if ($button.is(':visible')) {
                cy.get('#subscribe-popup .popup__box .popup__close > svg > use').click();
                cy.get('a.icon-cart').click();
            }
        })

        // Plus
        cy.get('.qty-box__button--plus').eq(0).click();
        cy.get('.cart-totals--final .cart-totals__number').should('have.text', '$3,498');
        cy.get('#cart .qty-box').eq(0).invoke('attr', 'data-fake-qty').then((number) => {
            expect(number).to.equal('2');
        });
        cy.get('.cart-item__qty-badge').eq(0).should('have.text', '2');
        cy.get('.cart-item__qty-badge').eq(1).should('have.text', '2');
        cy.get('.cart-item__qty-badge').eq(2).should('have.text', '2');

        // Minus
        cy.get('.qty-box__button--minus').eq(0).click();
        cy.get('.cart-totals--final .cart-totals__number').should('have.text', '$1,749');
        cy.get('#cart .qty-box').eq(0).invoke('attr', 'data-fake-qty').then((number) => {
            expect(number).to.equal('1');
        });
        cy.get('.cart-item__qty-badge').eq(0).should('have.text', '1');
        cy.get('.cart-item__qty-badge').eq(1).should('have.text', '1');
        cy.get('.cart-item__qty-badge').eq(2).should('have.text', '1');

        // Remove
        cy.get('.cart-item__remove').eq(0).click();
        cy.get('.cart-item__remove-confirmation--inner div').should('have.text', 'Are you sure you want to remove this item?')
        cy.get('.cart-totals--final .cart-totals__number').should('have.text', '$1,749');
        cy.get('.cart-item__remove-confirmation--inner button.jsItemRemove').contains('Remove').click();
        cy.get('div.cart-checkout__headline').should('have.text', 'Cart is empty');

    })

    it('User can Buy successfully', () => {
        cy.get('.pd-variants--size .pd-buttons__item').contains('Twin').click({ force: true });
        cy.get('#cta span').contains('Buy Now').click();
        cy.get('.loading-popup').should('be.visible');
        cy.get('.loading-popup__headline').should('contain', 'Preparing Your Order');
        cy.wait(5000);
        cy.url().should('contain', 'checkouts');
        let discountCode;
        cy.get('.focus-discount-code').then(($el) => {
            discountCode = $el.text();
        })
        // expect(discountCode).to.equal('SAVE1350');
        cy.get('#checkout_reduction_code').type('SAVE1350');
        cy.get('#checkout_submit').click();
        cy.get('.payment-due__price').should('contain', '$999');
        cy.get('ul.checkout-list > li').each(($el) => {
            cy.wrap($el).find('.cart-line__quantity').should('contain', '1');
        })
    })
})



